'use strict';

const pc = require('picocolors')
const db=require('../db/index')

const rules=require('../rules/entrenadores');
const Client = require('pg/lib/client');
const { develop, plataforma, api } = require('../config/config');
const { randomUUID, createHash } = require('crypto');
const { query } = require('express');



//ver los usuarios

async function getCoachs( req, res ) {
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

        const entrenadores=await db.findAll({client, query:`SELECT u.id, u.id_rol , u.nombre, u.telefono, u.estatus, a.correo_electronico 
                                                            FROM ca_usuarios u INNER JOIN ca_accesos a 
                                                            ON u.id=a.id_usuario WHERE id_rol=3`})

        if(entrenadores.code !==200){
            return res.status(entrenadores.code).send({
                mensaje:"Ocurrio un error al mostrar los entrenadores"
            });
        }

        return res.status(200).send({
            mensaje:"Entrenadores encontrados",
            data:entrenadores.data
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


async function getCoach( req, res ) {
    let client=null;

    try {
        const { params }=req;

        const val=rules.getCoach({params});

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

        const usuarios=await db.findOne({client, query:`SELECT * FROM ca_usuarios WHERE id='${params.id}' AND id_rol=3`})

        if(usuarios.code !==200){
            return res.status(usuarios.code).send({
                mensaje:"Ocurrio un error al mostrar los datos"
            });
        }

        if(!usuarios.data){
            return res.status(400).send({
                mensaje:"Lo sentimos, no se ha encontrado el usuario"
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

async function createCoach( req, res ) {
    let client=null;

    try {
        const { body }=req;
        const val=rules.createCoach({ body })
    
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
              mensaje: `Lo sentimos, no fue posible registrar al entrenador`,
            });
          }

        const entrenador=await db.findOne({client, query:`SELECT * FROM ca_accesos WHERE correo_electronico='${body.correoElectronico}' `})

        if(entrenador.code !== 200){
            await client.query('ROLLBACK');
            return res.status(entrenador.code).send({
                mensaje:'Ha ocurrido un error'
            });
        }

        if(entrenador.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje:'El correo ya se encuentra registrado'
            });
        }

        const registrarCoach=await db.insert({
            client, 
            insert:'INSERT INTO ca_usuarios(id, id_rol, nombre, telefono) VALUES($1, $2, $3, $4)',
            values:[randomUUID(), plataforma.roles.instructor ,body.nombreUsuario,body.telefono]
        });

        if(registrarCoach.code !==200){
            await client.query('ROLLBACK');
            return res.status(registrarCoach.code).send({
                mensaje:'Ocurrio un problema al registrar el entrenador'
            });
        }

        if(!registrarCoach.data){
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje:'Lo sentimos, no fue posible registrar el entrenador'
            });
        }

        const contrasenia=body.contrasenia;

        const contraseniaCifrada=createHash('sha256').update(contrasenia).digest('base64');

        const registrarAcceso= await db.insert({
            client,
            insert:`INSERT INTO ca_accesos(id, id_usuario,correo_electronico,contrasenia) VALUES($1, $2, $3, $4)`,
            values:[randomUUID(), registrarCoach.data.id, body.correoElectronico, contraseniaCifrada]
        });

        if(registrarAcceso.code !== 200){
            await client.query('ROLLBACK');
            return res.status(registrarAcceso.code).send({
                mensaje:"Ocurrio un error al registrar el entrenador"
            });
        }

        if(registrarAcceso.data > 0){
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje:'Lo sentimos, no fue posible registrar el entrenador'
            });
        }
        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Se ha registrado el entrenador ${body.nombreUsuario} correctamente`,
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

async function updateCoach( req, res) {
    let client=null;

    try {  
    const { params, body }=req
    const val=rules.updateCoach({params, body})

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
              mensaje: `Lo sentimos, no fue posible actualizar el entrenador`,
            });
          }

          const coach=await db.findOne({client, query:`SELECT * FROM ca_usuarios WHERE id='${params.id}' AND id_rol=3`});

          if(coach.code !== 200){
            await client.query('ROLLBACK')
            return res.status(coach.code).send({
              mensaje:'Ocurrio un error al validar la informacion'
            });
          }

          if(!coach.data){
            await client.query('ROLLBACK')
            return res.status(400).send({
              mensaje:'Lo sentimos, el entrenador no ha sido encontrado'
            })
          }

          const count= await db.count({client, query:`SELECT count(*) FROM ca_usuarios usr INNER JOIN ca_accesos acs
                                                    ON usr.id=acs.id_usuario WHERE usr.id !='${coach.data.id}' 
                                                    AND (usr.nombre='${body.nombreUsuario}' OR acs.correo_electronico='${body.correoElectronico}')`})

          if(count.code !== 200){
            await client.query('ROLLBACK')
            return res.status(count.code).send({
              mensaje:'Ocurrio un problema al validar los nuevos datos'
            });
          } 

          if(count.data > 0){
            await client.query('ROLLBACJ');
            return res.status(400).send({
              mensaje:'El nombre o el correo electronico ya se encuentran registrados'
            });

          }

          const updateCoach= await db.update({
            client,
            update:`UPDATE ca_usuarios SET nombre=$1, telefono=$2 WHERE id=$3`,
            values:[body.nombreUsuario, body.telefono, params.id]
          })

          if(updateCoach.code !== 200){
            await client.query('ROLLBACK');
            return res.status(500).send({
              mensaje:'Ocurrio un error al actualizar los datos'
            });
          }

          if(!updateCoach.data || updateCoach.data !== 1){
            await client.query('ROLLBACK');
            return res.status('500').send({
              mensaje:'No fue posible modificar los datos personales'
            });
          }

          const updateEmailCoach= await db.update({
            client,
            update:'UPDATE ca_accesos SET correo_electronico=$1 WHERE id_usuario=$2',
            values:[body.correoElectronico, params.id]
          });
          
          if(updateEmailCoach.code !== 200){
            await client.query('ROLLBACK')
            return res.status(500).send({
              mensaje:'Ocurrio un error al actualizar los datos'
            })
          }

          
          if(!updateEmailCoach.data || updateEmailCoach.data !== 1){
            await client.query('ROLLBACK');
            return res.status('500').send({
              mensaje:'No fue posible modificar los datos personales'
            });
          }

          await client.query('COMMIT');
        return res.status(200).send({
            mensaje:"Se actualizo tu informacion de manera correcta",
            data:updateCoach.data
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

//eliminar un usuario /pendiente por la posible eliminacion de los datos
// se me hace mas conveniente quitar la funcion o agregar una columa de status a la tablas 

async function changeStatusCoach( req, res ) {
    let client=null;

    try {
        const { params }= req;
        const val= rules.changeStatusCoach({params});
        
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
              mensaje: `Lo sentimos, no fue posible cambiar el estatus`,
            });
          }

        const coach=await db.findOne({client, query:`SELECT * FROM ca_usuarios  WHERE id='${params.id}' AND id_rol=3`})

        if( coach.code !==200 ){
          await client.query('ROLLBACK')
          return res.status(500).send({
            mensaje:'Lo sentimos, ocurrio un error al validar los datos'
          })
        }

        if(!coach.data){
           await client.query('ROLLBACK')
            return res.status(400).send({
                mensaje:"El usuario no se encuentra registrado"
            });
        }

        const text=coach.data.estatus ? 'deshabilitado' : 'habilitado';

        const estatus=!coach.data.estatus;


        const changeStatusCoach= await db.update({
          client,
          update:`UPDATE ca_usuarios SET estatus=$1 WHERE id=$2`,
          values:[estatus,params.id]
        })

        if(changeStatusCoach.code !== 200){
          await client.query('ROLLBACK');
          return res.status(500).send({
            mensaje:'Ocurrio un error al cambiar el estatus'
          });
        }

        if(!changeStatusCoach.data || changeStatusCoach.data !== 1 ){
          await client.query('ROLLBACK');
          return res.status(500).send({
            mensaje:'No fue posible cambiar el estatus'
          });
        }

        await client.query('COMMIT')

        return res.status(200).send({
            mensaje:`El estatus de ${coach.data.nombre} ha sido ${text} correctamente.`,

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
    getCoachs,
    getCoach,
    createCoach,
    updateCoach,
    changeStatusCoach,
}