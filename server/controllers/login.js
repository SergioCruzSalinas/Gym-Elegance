'use strict';

const { Client } = require('pg');
const { secret,  develop, plataforma, login, api, date } = require('../config/config');
const { createHash } = require('node:crypto')
const { createAuth } = require('../auth/index')
const { isUUID } = require('validator');

const pc = require('picocolors')
const rules = require('../rules/login');
const db = require('../db/index')
const moment = require('moment-timezone');

const jwt = require('jsonwebtoken');


async function createSession( req ,res ) {
    let client = null;
    try {
        const { body } = req
        const now = moment().tz(date.timeZone);
        const val = rules.createSession({body});
        if(val.code !== 200){
            return res.status(val.code).send({
                mensaje: val.message,
            });
        }
        client = new Client(develop)
        try {
            await client.connect();
            console.log(pc.green('Connected to PostgreSQL database'));
            await client.query('BEGIN');
        } catch (err) {
            console.log(err);
            console.log(pc.red('Error: connecting to PostgreSQL database'))
            return res.status(500).send({
                mensaje: 'Lo sentimos, no fue posible crear la sesion del usuario',
            });
        }

        const user = await db.findOne({
            client,
            query:`SELECT
                   ca.id as id_acceso,
                   ca.id_usuario,
                   ca.contrasenia,
                   ca.numero_intentos,
                   ca.token,
                   ca.fecha_token,
                   ca.fecha_bloqueo,
                   cu.id as id_usuario,
                   cu.id_rol,
                   cu.nombre,
                   cu.telefono,
                   cu.estatus
                   FROM ca_accesos ca INNER JOIN ca_usuarios cu
                   ON ca.id_usuario = cu.id
                   WHERE ca.correo_electronico = '${body.correoElectronico}'`
                });
        if(user.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(user.code).send({
                mensaje: `Ocurrió un problema al obtener los datos del usuario`,
            });
        }

        if(!user.data) {
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje: 'Usuario y/o contraseñas no válidos',
            });
        }

        if([plataforma.roles.root, plataforma.roles.admin, plataforma.roles.instructor, plataforma.roles.usuario].includes(user.data.id_rol)){
            if(!user.data.estatus){
                await client.query('ROLLBACK');
                return res.status(400).send({
                    mensaje: 'El usuario ha sido dado de baja, favor de contactar con el administrador',
                });
            }
        }

        if(user.data.fecha_bloqueo){
            const blockDate = moment.tz(user.data.fecha_bloqueo, date.timeZone);
            if(now <= blockDate){
                await client.query('ROLLBACK');
                return res.status(400).send({
                    mensaje: 'El usuario ha sido bloqueado'
                });
            }
        }

        if(user.data.token) {
            const tokenDate = moment.tz(user.data.fecha_token, date.timeZone);
            if(now <= tokenDate) {
                await client.query('ROLLBACK');
                return res.status(400).send({
                    mensaje: 'El usuario ya cuenta con una sesión activa',
                });
            }
        }

        const contraseniaCifrada = createHash('sha256').update(body.contrasenia).digest('base64')

        if(user.data.contrasenia !== contraseniaCifrada) {
            if(user.data.numero_intentos >= login.numeroIntentos){
                const userUpdated = await db.update({
                    client,
                    update:'UPDATE ca_accesos SET fecha_bloqueo=$1 WHERE id=$2 ',
                    values:[now.add(login.tiempoBloqueo, 'm'), user.data.id_acceso]
                });

                if(userUpdated.code !==  200) {
                    await client.query('ROLLBACK');
                    return res.status(userUpdated.code).send({
                        mensaje: `Ocurrió un problema al iniciar sesión, favor de intentar más tarde`,
                    });
                }

                if(userUpdated.data !== 1) {
                    await client.query('ROLLBACK');
                    return res.status(400).send({
                        mensaje: 'No fue posible iniciar la sesión'
                    });
                }

                await client.query('COMMIT');

                return res.status(400).send({
                    mensaje: 'El usuario se ha bloqueado ya que se sobrepaso el número de intentos permitidos',
                });
            }else{
                const userUpdated = await db.update({
                    client,
                    update:'UPDATE ca_accesos SET numero_intentos = $1 WHERE id=$2',
                    values: [user.data.numero_intentos + 1, user.data.id_acceso],
                });

                if(userUpdated.code !==  200) {
                    await client.query('ROLLBACK');
                    return res.status(userUpdated.code).send({
                        mensaje: `Ocurrió un problema al iniciar sesión, favor de intentar más tarde`,
                    });
                }

                if(userUpdated.data !== 1) {
                    await client.query('ROLLBACK');
                    return res.status(400).send({
                        mensaje: 'No fue posible iniciar la sesión'
                    });
                }

                await client.query('COMMIT');
                return res.status(400).send({
                    mensaje: 'Usuario y/o contraseña no validos'
                });
            }
        }        

        const token = createAuth({
            id_usuario: user.data.id_usuario,
            id_rol: user.data.id_rol,
        });

        const userUpdated = await db.update({
            client,
            update:'UPDATE ca_accesos SET token = $1, fecha_token = $2, numero_intentos = $3, fecha_bloqueo = $4 WHERE id = $5;',
            values:[token, now.add(login.tiempoSesion, 'm'), 0, null, user.data.id_acceso],
        });

        if( userUpdated.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(userUpdated.code).send({
                mensaje: 'Ocurrió un problema al iniciar sesión, favor de intentar más tarde',
            });
        }
        if(userUpdated.data !== 1) {
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje: 'No fue posible iniciar sesión',
            });
        }

        await client.query('COMMIT');

        return res.status(200).send({
            data:{
                nombre: user.data.nombre,
                rol: user.data.id_rol,
                at: token,
            },
        });
                
    } catch (error) {
        console.log(error);
        if(client) await client.query('ROLLBACK');
        return res.status(500).send({
            mensaje: api.errorGeneral
        });
    }finally {
        if(client){
            try {
                await client.end();
                console.log(pc.cyan('Connection to PostgreSQL closed'));
            } catch (error) {
                console.log(error)
                console.log(pc.red('Error closing connection'))
            }
        }
    }
    
}


// Funcion encargada de validar el token de sesion
async function checkToken(req, res){ 
    let client = null;

    try {
        if(!req.headers.authorization){
            return res.status(403).send({
                err_code: 'EA-001',
                mensaje: api.errorAuthentication,
            });
        }

        const token = req.headers.authorization.replace(/^Bearer /, '').replace(/['"]+/g, '');
        console.log('token esperado', token)

        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            console.log('token esperado', token)
        } catch (err) {
            console.log(err)
            console.log(pc.yellow('Error: '), pc.red(err.message));
            return res.status(403).send({
                mensaje: api.errorSesionExpirada,
            });            
        }
        if(!decoded.iu || !isUUID(decoded.iu) || !decoded.ir){
            return res.status(403).send({
                err_code: 'EA-004',
                mensaje: api.errorSinAutorizacion
            });
        }

        client = new Client(develop);
        try {
            await client.connect();
            console.log(pc.cyan('Connected to PostgreSQL database'));
        } catch (err) {
            console.log(err);
            console.error(pc.red('Error: connecting to PostgreSQL database'));
            return res.status(500).send({
                err_code: 'EA-005',
                mensaje: 'Lo sentimos, no fue posible continuar con el proceso de autenticacion'
            });
        }

        const user = await db.count({
            client,
            query: `SELECT count(*) FROM ca_accesos WHERE id_usuario = '${decoded.iu}' AND token = '${token}' ;`
        });

        if(user.code !== 200) {
            return res.status(user.code).send({
                err_code: 'EA-006',
                mensaje: `Lo sentimos, la sesión del usuario no es válida`,
            });
        }

        await client.query('COMMIT');
        return res.status(200).send({
            data:{
                id: decoded.iu,
                rol: decoded.ir,
                at: token,

            }
        })


        
    } catch (error) {
        console.log(error);
        console.log(pc.yellow('Error: '), pc.red(error.message));
        return res.status(401).send({
            err_code: 'EA-000',
            mensaje: api.errorAuthentication,
        });
    }finally {
        if(client){
            try {
                await client.end();
                console.log(pc.cyan('Connection to PostgreSQL closed'));
            } catch (error) {
                console.log(error)
                console.log(pc.red('Error closing connection'));
                
            }

        }
    }

}

async function closeSession( req ,res ) {
    let client = null;
    try {
        const { user } = req

        client = new Client(develop);
        try {
            await client.connect();
            console.log(pc.cyan('Connected to PostgreSQL database'));
            await client.query('BEGIN');
            console.log(pc.yellow('Transaction started'));
        } catch (err) {
            console.log(err);
            console.error(pc.red('Error: connecting to PostgreSQL database'));
            return res.status(500).send({
              mensaje: `Lo sentimos, no fue posible cerrar la sesión del usuario`,
            });
        }

        const userUpdated = await db.update({
            client,
            update:'UPDATE ca_accesos SET token=$1, fecha_token=$2, WHERE id_usuario=$3',
            values:[null, null, user.id_usuario]
        });

        if(userUpdated.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(userUpdated.code).send({
                mensaje: 'Ocurrió un problema al cerrar la sesión, favor de intentar más tarde',
            });
        }

        if(userUpdated.data !== 200) {
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje: `No fue posible cerrar la sesión, favor de intentar más tarde`,
            });
        }

        await client.query('COMMIT');

        return res.status(200).send({
            mensaje: 'Se ha cerrado la sesión correctamente',
        });
    } catch (error) {
        console.log(error);
        if (client) await client.query('ROLLBACK');
        return res.status(500).send({
        mensaje: api.errorGeneral,
        });
    } finally {
        if(client) {
            try {
                await client.end();
                console.log(pc.cyan('Connection to PostgreSQL closed'));
            } catch (error) {
                console.log(err);
                console.log(pc.red('Error closing connection'));
            }        
        }
    }

}
    


async function recoveryPassword( req ,res ) {
    console.log('recuperar contraseña')
    
}

async function restorePassword( req ,res ) {
    console.log('restablecer contraseña')
    
}

async function changePassword( req, res) {
    console.log('cambiar contraseña')
    
}

module.exports={
    createSession,
    checkToken,
    closeSession,
    recoveryPassword,
    restorePassword,
    changePassword,
}




