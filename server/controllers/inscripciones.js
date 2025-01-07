'use strict';

const pc = require('picocolors')
const db=require('../db/index')
const { isUUID } = require("validator");


const rules= require('../rules/inscripciones')
const Client = require('pg/lib/client');
const { develop, api, regex } = require('../config/config');
const { formatDate } = require('./utils');


//Notas: falta hacer la paginacion y cambiar el tipo de dato de la fecha para que solo muestre la fecha en la base de datos


//ver los usuarios

async function getInscripciones( req, res ) {
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

        const inscripciones=await db.findAll({client, query:'SELECT * FROM rel_inscripciones'})

        if(inscripciones.code !==200){
            return res.status(inscripciones.code).send({
                mensaje:"Ocurrio un error al mostrar las inscripciones"
            });
        }

        if(!inscripciones.data){
          return res.status(400).send({
            mensaje:'No hay actividades registradas'
          });
        }

        return res.status(200).send({
            data:inscripciones.data
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

async function getInscripcion( req, res ) {
  //hace falta paginacion y trasacciones en la demas acciones db
  let client=null;

  try {
    const { params }= req;
    const val=rules.getInscripcion({ params })
    
    if(val.code !==200){
        return res.status(val.code).send({
            mensaje:val.message
        })
    };

      client=new Client(develop);
      try {
          await client.connect();
          console.log(pc.blue("Connected to PostgreSQL database"));
      } catch (error) {
          console.log(error);
      }

      if(isUUID(params.id.trim())){
        const inscripcionUsuario = await db.findOne({client, query:`SELECT * FROM rel_inscripciones WHERE id_usuario = '${params.id}' AND estatus = true`})

        if( inscripcionUsuario.code !== 200){
          return res.status(inscripcionUsuario.code).send({
            data: "Ocurrio un error al ver la inscripcion"
          })
        }

        if( !inscripcionUsuario.data) {
          return res.status(400).send({
            data: "Inscripción no encontrada o su vigencia ha expirado."
          })
        }

        const fechaInicio = formatDate(inscripcionUsuario.data.fecha_inicio)
        const fechaExpiracion = formatDate(inscripcionUsuario.data.fecha_expiracion)


        return res.status(200).send({
          data: {
            id: inscripcionUsuario.data.id,
            id_usuario: inscripcionUsuario.data.id_usuario,
            id_membresia: inscripcionUsuario.data.id_membresia,
            fecha_inicio: fechaInicio,
            estatus: inscripcionUsuario.data.estatus,
            fecha_expiracion: fechaExpiracion,


          }
        });

      }

      const inscripcionFolio = await db.findOne({client, query:`SELECT * FROM rel_inscripciones WHERE id = '${params.id}'`});

      if( inscripcionFolio.code !==200){
        return res.status(inscripcionFolio.code).send({
            mensaje:"Ocurrio un error al mostrar la inscripcion"
        });
    }

    if(!inscripcionFolio.data){
      return res.status(400).send({
        mensaje: 'No se encuentra la inscripcion'
      });
    }

    const fechaInicio = formatDate(inscripcionFolio.data.fecha_inicio)
    const fechaExpiracion = formatDate(inscripcionFolio.data.fecha_expiracion)

    return res.status(200).send({
      data: {
        id: inscripcionFolio.data.id,
        id_usuario: inscripcionFolio.data.id_usuario,
        id_membresia: inscripcionFolio.data.id_membresia,
        fecha_inicio: fechaInicio,
        estatus: inscripcionFolio.data.estatus,
        fecha_expiracion: fechaExpiracion,
      }

    });

      
      
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

//crear un usuario (acabado)

async function createInscripcion( req, res ) {
    let client=null;

    try {
        const { body }=req;
        const regexClave=new RegExp(regex.clave.pattern)
        const val=rules.createInscripcion({ body })
    
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
              mensaje: `Lo sentimos, no fue posible hacer la inscripcion`,
            });
          }

          const usuario = await db.findOne({client, query:`SELECT * FROM ca_usuarios WHERE id='${body.id_usuario}'`});

          if( usuario.code !== 200 ){
            await client.query('ROLLBACK')
            return res.status( usuario.code ).send({
              mensaje:'Ocurrio un error al validar los datos'
            });
          }

          if( !usuario.data ){
            await client.query('ROLLBACK');
            return res.status( 400 ).send({
              mensaje:'El usuario no se encuentra registrado'
            });
          }

          const membresiaActiva = await db.findOne({client, query:`SELECT * FROM ca_membresias WHERE id=${body.id_membresia}`})

          if( membresiaActiva.code !== 200 ){
            await client.query('ROLLBACK');
            return res.status( membresiaActiva.code ).send({
              mensaje:'Ocurrio un error al validar los datos'
            })
          }

          if( !membresiaActiva.data || !membresiaActiva.data.estatus){
            await client.query('ROLLBACK');
            return res.status( 400 ).send({
              mensaje:'Lo sentimos, la membresia no se encuentra registrada o esta inactiva'
            })
          }

          const count= await db.count({client, query:`SELECT COUNT(*) FROM rel_inscripciones`})

          if( count.code !== 200 ){
            await client.query('ROLLBACK');
            return res.status( count.code ).send({
              mensaje:'Ocurrio un error al validar los datos'
            })
          }
          
          //crear el folio
      
          const clave= await CrearClave(count.data)
          
          //Se crea la fecha de expiracion de la inscripcion

          const finalInscripcion= await calcularFechaFinalizacion(body.fecha_inicio, membresiaActiva.data.mes_duracion, membresiaActiva.data.dias_duracion)

          console.log('finalInscripcion*********', finalInscripcion)

          const crearInscripcion= await db.insert({
            client,
            insert:'INSERT INTO rel_inscripciones(id, id_usuario, id_membresia, estatus, fecha_inicio, fecha_expiracion) VALUES($1, $2, $3, $4, $5, $6)',
            values:[clave, body.id_usuario , body.id_membresia, true, body.fecha_inicio, finalInscripcion]
          })

          if( crearInscripcion.code !==200 ){
            await client.query('ROLLBACK');
            return res.status( crearInscripcion.code ).send({
              mensaje:'Lo sentimos, no se pudo crear la inscripcion'
            })
          }

          if( !crearInscripcion.data ){
            await client.query('ROLLBACK');
            return res.status( 500 ).send({
              mensaje:'Ocurrio un error al realizar la inscripcion'
            })
          }

        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Se ha registrado la inscripcion con el folio ${crearInscripcion.data.id} correctamente`,
            data:crearInscripcion.data
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

async function updateInscripcion( req, res) {
    let client=null;

    try {  
    const { params, body }=req
    const val=rules.updateInscripcion({params, body})

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
              mensaje: `Lo sentimos, no fue posible actualizar los datos de la inscripcion`,
            });
          }

          const inscripcion=await db.findOne({client, query:`SELECT * FROM rel_inscripciones WHERE id='${params.id}' `});

          if(inscripcion.code !== 200){
            await client.query('ROLLBACK')
            return res.status(inscripcion.code).send({
              mensaje: 'Ocurrio un error al validar la informacion'
            });
          }

          if(!inscripcion.data){
            await client.query('ROLLBACK')
            return res.status(400).send({
              mensaje:'Lo sentimos, La inscripcion no ha sido encontrada'
            })
          }

          const usuario = await db.findOne({client, query:`SELECT * FROM ca_usuarios WHERE id='${body.id_usuario}' `})

          if( usuario.code !== 200 ){
            await client.query('ROLLBACK');
            return res.status(500).send({
              mensaje:'Ocurrio un error al validar los datos'
            })
          }

          if( !usuario.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'El usuario no se encuentra registrado'
            })
          }

          const fechaActual = new Date();
          const fechaInicioDB = inscripcion.data.fecha_inicio.toISOString().split('T')[0]; // Convierte a 'YYYY-MM-DD'
          const fecha = fechaActual.toISOString().split('T')[0]; // Convierte a 'YYYY-MM-DD'


          
          if (body.fecha_inicio !== fechaInicioDB) {
            if ( fecha > fechaInicioDB) {
              await client.query('ROLLBACK');
              return res.status(400).send({
                mensaje: 'No se puede cambiar la fecha de inicio días después de que se realizó la inscripción'
              });
            }
          }

          const membresiaActiva = await db.findOne({ client, query:` SELECT * FROM ca_membresias WHERE id='${body.id_membresia}' AND estatus= true `})

          if( membresiaActiva.code !== 200 ){
            await client.query('ROLLBACK')
            return res.status(500).send({
              mensaje:'Ocurrio un error al validar los datos'
            })
          }

          if( !membresiaActiva.data ){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'La membresia no se encuentra registrada o esta inactiva'
            })
          }

          const finalInscripcion= await calcularFechaFinalizacion(body.fecha_inicio, membresiaActiva.data.mes_duracion, membresiaActiva.data.dias_duracion)

          const  updateInscripcion= await db.update({
            client,
            update:`UPDATE rel_inscripciones SET id_usuario=$1, id_membresia=$2, fecha_inicio=$3, fecha_expiracion=$4  WHERE id=$5` ,
            values:[body.id_usuario, body.id_membresia, body.fecha_inicio, finalInscripcion, params.id]
          })

          if(updateInscripcion.code !== 200){
            await client.query('ROLLBACK');
            return res.status(updateInscripcion.code).send({
              mensaje:'Ocurrio un error al actualizar los datos de la inscripcion'
            });
          }

          if(!updateInscripcion.data || updateInscripcion.data !== 1){
            await client.query('ROLLBACK');
            return res.status('500').send({
              mensaje:'No fue posible modificar los datos de la inscripcion'
            });
          }

        await client.query('COMMIT');
        return res.status(200).send({
            mensaje:`Se actualizo la informacion de la inscripcion (${params.id})`,
            data: inscripcion.data,
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



//cambiar el estatus de una actividad
async function changeStatusInscripcion( req, res ) {
    let client=null;

    try {
        const { params }= req;
        const val= rules.changeStatusInscripcion({params});
        
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
              mensaje: `Lo sentimos, no fue posible cambiar el estatus de la actividad`,
            });
          }

        const inscripcion=await db.findOne({client, query:`SELECT * FROM rel_inscripciones WHERE  id='${params.id}'`})

        if(inscripcion.code !==200){
          await client.query('ROLLBACK')
          return res.status(actividad.code).send({
            mensaje:'Lo sentimos, ocurrio un error al cambiar el estatus de la inscripcion'
          })
        }

        if(!inscripcion.data){
           await client.query('ROLLBACK')
            return res.status(400).send({
                mensaje:"La inscripcion no se encuentra registrada"
            });
        }

        //verficra que las fecha actual sea mayor que la fecha de inicio de la inscripcion

        const fechaActual= new Date;
        const fecha=fechaActual.toISOString().split('T')[0];
        const fechaExpiracion= inscripcion.data.fecha_expiracion.toISOString().split('T')[0];


        console.log(fecha);
        console.log(fechaExpiracion)

        if( fechaExpiracion > fecha){
          await client.query('ROLLBACK');
          return res.status(400).send({
            mensaje:'El estatus no puede ser modificado, ya que la fecha de expiración de la inscripción aún no ha sido alcanzada'
          })
        }

        const changeStatusInscripcion= await db.update({
          client,
          update:`UPDATE rel_inscripciones SET estatus=$1 WHERE id=$2`,
          values:[false,params.id]
        })

        if(changeStatusInscripcion.code !== 200){
          await client.query('ROLLBACK');
          return res.status(500).send({
            mensaje:'Ocurrio un error al cambiar el estatus de la actividad'
          });
        }

        if(!changeStatusInscripcion.data || changeStatusInscripcion.data !== 1 ){
          await client.query('ROLLBACK');
          return res.status(500).send({
            mensaje:'No fue posible cambiar el estatus de la actividad'
          });
        }

        await client.query('COMMIT')
        return res.status(200).send({
            mensaje:`Se ha finalizado la inscripcion ${inscripcion.data.id}`,

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
    getInscripciones,
    getInscripcion,
    createInscripcion,
    updateInscripcion,
    changeStatusInscripcion,

}

//Funcion para crear la clave
async function CrearClave(id) {
  const base="gym-"
  const clave=base+id

  return clave
}


// funcion para crear la fecha de finalizacion

async function calcularFechaFinalizacion(fechaInicio, meses, dias) {
  // Crear un nuevo objeto Date basado en la fecha de inicio
  let fechaFinal = new Date(fechaInicio);
  
  // Sumar los meses al objeto Date
  fechaFinal.setMonth(fechaFinal.getMonth() + meses);
  
  // Sumar los días al objeto Date
  fechaFinal.setDate(fechaFinal.getDate() + dias);
  
  // Formatear la fecha en formato YYYY-MM-DD
  const año = fechaFinal.getFullYear();
  const mes = (fechaFinal.getMonth() + 1).toString().padStart(2, '0'); // Añadir 1 porque los meses son 0-indexados
  const dia = fechaFinal.getDate().toString().padStart(2, '0');
  
  return `${año}-${mes}-${dia}`;
}
