'use strict';

const pc = require('picocolors')
const db=require('../db/index')

const rules=require('../rules/usuarios');
const Client = require('pg/lib/client');
const { develop, plataforma, api } = require('../config/config');
const { randomUUID, createHash } = require('crypto');



//ver los usuarios

async function getUsers( req, res ) {
    //hace falta paginacion y trasacciones en la demas acciones db
    let client=null;

    try {
        client=new Client(develop);
        try {
            await client.connect();
            console.log(pc.blue("Connected to PostgreSQL database"));
        } catch (error) {
            console.log(error);
        }

        const usuarios=await db.findAll({client, query:'SELECT * FROM ca_usuarios'})

        if(usuarios.code !==200){
            return res.status(usuarios.code).send({
                mensaje:"Ocuarrio un error al mostrar los usuarios"
            });
        }

        return res.status(200).send({
            mensaje:"usuarios encontrados",
            data:usuarios.data
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send({
          mensaje: api.errorGeneral,
        });
      } finally {
        // close the connection when done
        if (client) {
          try {
            await client.end();
            console.log(pc.blue('Connection to PostgreSQL closed'));
          } catch (err) {
            console.log(err);
            console.log(pc.red('Error closing connection'));
          }
        }
      }

};


async function getUser( req, res ) {
    let client=null;

    try {
        const { params }=req;

        const val=rules.getUser({params});

        if(val.code !== 200){
            return res.status(val.code).send({
                mensaje:val.message
            })
        }

        client=new Client(develop);
        try {
            await client.connect();
            console.log(pc.blue("Connected to PostgreSQL database"));
        } catch (error) {
            console.log(error);
        }

        const usuarios=await db.findOne({client, query:`SELECT * FROM ca_usuarios WHERE id='${params.id}'`})

        if(usuarios.code !==200){
            return res.status(usuarios.code).send({
                mensaje:"Ocuarrio un error al mostrar los datos del usuario"
            });
        }

        if(!usuarios.data){
            return res.status(400).send({
                mensaje:"El usuario no se encuentra registrado"
            });
        }

        return res.status(200).send({
            mensaje:"usuario encontrado",
            data:usuarios.data
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send({
          mensaje: api.errorGeneral,
        });
      } finally {
        // close the connection when done
        if (client) {
          try {
            await client.end();
            console.log(pc.blue('Connection to PostgreSQL closed'));
          } catch (err) {
            console.log(err);
            console.log(pc.red('Error closing connection'));
          }
        }
      }
    
}



//crear un usuario (acabado)

async function createUser( req, res ) {
    let client=null;

    try {
        const { body }=req;
        const val=rules.createUser({ body })
    
        if(val.code !==200){
            return res.status(val.code).send({
                mensaje:val.message
            })
        };
        client=new Client(develop);
        try {
            await client.connect();
            console.log(pc.blue("Connected to PostgreSQL database"));
            await client.query('BEGIN');
            console.log(pc.yellow('Transaction started'));
        }  catch (err) {
            console.log(err);
            console.error(pc.red('Error: connecting to PostgreSQL database'));
            return res.status(500).send({
              mensaje: `Lo sentimos, no fue posible registrar al becario`,
            });
          }

        const usuario=await db.findOne({client, query:`SELECT * FROM ca_accesos WHERE correo_electronico='${body.correoElectronico}' `})

        if(usuario.code !== 200){
            await client.query('ROLLBACK');
            return res.status(usuario.code).send({
                mensaje:'Ha ocurrido un error'
            });
        }

        if(usuario.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje:'El correo ya se encuentra registrado'
            });
        }

        const registrarUsuario=await db.insert({
            client, 
            insert:'INSERT INTO ca_usuarios(id, id_rol, nombre, telefono) VALUES($1, $2, $3, $4)',
            values:[randomUUID(), plataforma.roles.usuario ,body.nombreUsuario,body.telefono]
        });

        if(registrarUsuario.code !==200){
            await client.query('ROLLBACK');
            return res.status(registrarUsuario.code).send({
                mensaje:'Ocurrio un problema al registrarse'
            });
        }

        if(!registrarUsuario.data){
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje:'Lo sentimos, no fue posible registrar el usuario'
            });
        }

        const contrasenia=body.contrasenia;

        const contraseniaCifrada=createHash('sha256').update(contrasenia).digest('base64');

        const registrarAcceso= await db.insert({
            client,
            insert:`INSERT INTO ca_accesos(id, id_usuario,correo_electronico,contrasenia) VALUES($1, $2, $3, $4)`,
            values:[randomUUID(), registrarUsuario.data.id, body.correoElectronico, contraseniaCifrada]
        });

        if(registrarAcceso.code !== 200){
            await client.query('ROLLBACK');
            return res.status(registrarAcceso.code).send({
                mensaje:"Ocurrio un error al registrarse"
            });
        }

        if(registrarAcceso.data > 0){
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje:'Lo sentimos, no fue posible registrar el usuario'
            });
        }
        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Se ha registrado el usuario ${body.nombreUsuario} correctamente`,
            data:registrarUsuario.data
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send({
          mensaje: api.errorGeneral,
        });
      } finally {
        // close the connection when done
        if (client) {
          try {
            await client.end();
            console.log(pc.blue('Connection to PostgreSQL closed'));
          } catch (err) {
            console.log(err);
            console.log(pc.red('Error closing connection'));
          }
        }
      }
    
};

//editar un usuario

async function updateUser( req, res) {
    let client=null;

    try {  
    const { params, body }=req
    const val=rules.updateUser({params, user})

    if(val.code !== 200){
        return res.status(val.code).send({
            mensaje:val.message
        });
    };
        client=new Client(develop);
        try {
            await client.connect();
            console.log(pc.blue("Connected to PostgreSQL database"));
            await client.query('BEGIN');
            console.log(pc.yellow('Transaction started'));
        }  catch (err) {
            console.log(err);
            console.error(pc.red('Error: connecting to PostgreSQL database'));
            return res.status(500).send({
              mensaje: `Lo sentimos, no fue posible registrar al becario`,
            });
          }


        return res.status(200).send({
            mensaje:"usuarios encontrados",
            data:usuarios.data
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send({
          mensaje: api.errorGeneral,
        });
      } finally {
        // close the connection when done
        if (client) {
          try {
            await client.end();
            console.log(pc.blue('Connection to PostgreSQL closed'));
          } catch (err) {
            console.log(err);
            console.log(pc.red('Error closing connection'));
          }
        }
      }

    
};

//eliminar un usuario

async function deleteUser( req, user ) {
    let client=null;

    try {
        const { params }= req;
        const val= rules.deleteUser(req);
        
        if(val.code !==200){
            return res.status(val.code).send({
                mensaje:val.message
            });
        };

        client=new Client(develop);
         try {
            await client.connect();
            console.log(pc.blue("Connected to PostgreSQL database"));
            await client.query('BEGIN');
            console.log(pc.yellow('Transaction started'));
        }  catch (err) {
            console.log(err);
            console.error(pc.red('Error: connecting to PostgreSQL database'));
            return res.status(500).send({
              mensaje: `Lo sentimos, no fue posible registrar al becario`,
            });
          }

        const usuarios=await db.findAll({client, query:'SELECT * FROM ca_usuarios'})

        if(usuarios.code !==200){
            return res.status(usuarios.code).send({
                mensaje:"Ocurrio un error al mostrar los usuarios"
            });
        }

        return res.status(200).send({
            mensaje:"usuarios encontrados",
            data:usuarios.data
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send({
          mensaje: api.errorGeneral,
        });
      } finally {
        // close the connection when done
        if (client) {
          try {
            await client.end();
            console.log(pc.blue('Connection to PostgreSQL closed'));
          } catch (err) {
            console.log(err);
            console.log(pc.red('Error closing connection'));
          }
        }
      }
    
}






module.exports={
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,


}