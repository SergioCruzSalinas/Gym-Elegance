'use strict';

const pc = require('picocolors')
const db=require('../db/index')

const rules=require('../rules/usuarios');
const Client = require('pg/lib/client');
const { develop, plataforma, api } = require('../config/config');
const { randomUUID, createHash } = require('crypto');
const { query } = require('express');
const { send } = require('process');



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

        const usuarios=await db.findOne({client, query:`SELECT u.id, u.id_rol, u.nombre, u.telefono, u.estatus, a.correo_electronico
                                                        FROM ca_usuarios u 
                                                        INNER JOIN ca_accesos a
                                                        ON u.id = a.id_usuario 
                                                        WHERE u.id = '${params.id}' `})

        if(usuarios.code !==200){
            return res.status(usuarios.code).send({
                mensaje:"Ocurrio un error al mostrar los datos"
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
              mensaje: `Lo sentimos, no fue posible registrarse.`,
            });
          }

        const usuario=await db.findOne({client, query:`SELECT * FROM ca_accesos WHERE correo_electronico='${body.correoElectronico}'`})

        const nameUser = await db.findOne({ client, query: `SELECT * FROM ca_usuarios WHERE nombre='${body.nombreUsuario}'`})

        if( nameUser.code !== 200) {
          await client.query('ROLLBACK');
          return res.status(nameUser.code)-send({
            mensaje: 'Ha ocurrido un error'
          });
        }

        if(nameUser.data){
          await client.query('ROLLBACK');
          return res.status(400).send({
            mensaje: 'El correo electronico o el nombre ya se encuentra registrado'
          });
        }

        if(usuario.code !== 200){
            await client.query('ROLLBACK');
            return res.status(usuario.code).send({
                mensaje:'Ha ocurrido un error'
            });
        }

        if(usuario.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje:'El correo electronico o el nombre ya se encuentra registrado'
            });
        }

        const registrarUsuario=await db.insert({
            client, 
            insert:'INSERT INTO ca_usuarios(id, id_rol, nombre, telefono) VALUES($1, $2, $3, $4)',
            values:[randomUUID(), plataforma.roles.usuario ,body.nombreUsuario,body.telefono]
        });

        if(registrarUsuario.code !==200){
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje:'Ocurrio un problema al registrarse'
            });
        }

        if(!registrarUsuario.data){
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje:'Lo sentimos, no fue posible registrarse'
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
    const val=rules.updateUser({params, body})

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
              mensaje: `Lo sentimos, no fue posible actualizar los datos.`,
            });
          }

          const usuario=await db.findOne({client, query:`SELECT * FROM ca_usuarios WHERE id='${params.id}' `});

          if(usuario.code !== 200){
            await client.query('ROLLBACK')
            return res.status(usuario.code).send({
              mensaje:usuario.message
            });
          }

          if(!usuario.data){
            await client.query('ROLLBACK')
            return res.status(400).send({
              mensaje:'Lo sentimos, el usuario no ha sido encontrado'
            })
          }

          const count= await db.count({client, query:`SELECT count(*) FROM ca_usuarios usr INNER JOIN ca_accesos acs
                                                    ON usr.id=acs.id_usuario WHERE usr.id !='${usuario.data.id}' 
                                                    AND (usr.nombre='${body.nombreUsuario}' OR acs.correo_electronico='${body.correoElectronico}')`})

          if(count.code !== 200){
            await client.query('ROLLBACK')
            return res.status(count.code).send({
              mensaje:'Ocurrio un problema al validar los nuevos datos.'
            });
          } 

          if(count.data > 0){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'El nombre o el correo electronico ya se encuentran registrados'
            });

          }

          const updateUser= await db.update({
            client,
            update:`UPDATE ca_usuarios SET nombre=$1, telefono=$2 WHERE id=$3`,
            values:[body.nombreUsuario, body.telefono, params.id]
          })

          if(updateUser.code !== 200){
            await client.query('ROLLBACK');
            return res.status(updateUser.code).send({
              mensaje:'Ocurrio un error al actualizar los datos.'
            });
          }

          if(!updateUser.data || updateUser.data !== 1){
            await client.query('ROLLBACK');
            return res.status('500').send({
              mensaje:'No fue posible modificar los datos.'
            });
          }

          const updateEmailUser= await db.update({
            client,
            update:'UPDATE ca_accesos SET correo_electronico=$1 WHERE id_usuario=$2',
            values:[body.correoElectronico, params.id]
          });
          
          if(updateEmailUser.code !== 200){
            await client.query('ROLLBACK')
            return res.status(updateEmailUser.code).send({
              mensaje:'Ocurrio un error al actualizar los datos'
            })
          }

          
          if(!updateEmailUser.data || updateEmailUser.data !== 1){
            await client.query('ROLLBACK');
            return res.status('500').send({
              mensaje:'No fue posible modificar los datos personales del usuario'
            });
          }

          await client.query('COMMIT');
        return res.status(200).send({
            mensaje:"Se actualizo tu informacion de manera correcta",
            data:updateUser.data
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

async function deleteUser( req, res ) {
    let client=null;

    try {
        const { params }= req;
        const val= rules.deleteUser(params);
        
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
              mensaje: `Lo sentimos, no fue posible eliminar`,
            });
          }

        const usuario=await db.findOne({client, query:`SELECT * FROM WHERE id='${params.id}'`})

        if(usuario.code !==200){
          await client.query('ROLLBACK')
          return res.status(usuario.code).send({
            mensaje:'Lo sentimos, ocurrio un error al validar los datos'
          })
        }

        if(!usuario.data){
           await client.query('ROLLBACK')
            return res.status(400).send({
                mensaje:"El usuario no se encuntra registrado"
            });
        }

        const eliminarUsuario=await db.destroy({client, 
                                               destroy:'DELETE FROM ca_usuarios WHERE id=$1;', 
                                               values:[params.id]});
        
        if(eliminarUsuario.code !== 200){
          await client.query('ROLLBACK');
          return res.status(eliminarUsuario.code).send({
            mensaje:'Ocurrio un error al eliminar el usuario'
          })

        }

        return res.status(200).send({
            mensaje:"El usuario ha sido eliminado",

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