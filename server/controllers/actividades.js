'use strict';

const pc = require('picocolors')
const db=require('../db/index')

const rules= require('../rules/actividades')
const Client = require('pg/lib/client');
const { develop, plataforma, api } = require('../config/config');
const { formatHour, formatDate } = require('./utils');

//Notas: falta hacer la paginacion y cambiar el tipo de dato de la fecha para que solo muestre la fecha en la base de datos




async function getActivities( req, res ) {
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

        const actividades=await db.findAll({client, query:'SELECT * FROM ca_actividades'})

        if(actividades.code !==200){
            return res.status(actividades.code).send({
                mensaje:"Ocurrio un error al mostrar las actividades"
            });
        }

        if(!actividades.data){
          await client.query('ROLLBACK');
          return res.status(400).send({
            mensaje:'No hay actividades registradas'
          });
        }

        return res.status(200).send({
            data:actividades.data
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

async function getActivity(req, res) {
  let client = null;
  try {
    const { params } = req 
    const val = await rules.getActivity({params});

    if(val.code !== 200) {
      return res.status(val.code).send({
        mensaje: val.message
      })
    }

    client = new Client(develop)
    try {
      await client.connect();
      console.log(pc.blue("Connected to PostgreSQL database"));
    } catch (err) {
      console.log(err);
      console.error(pc.red('Error: connecting to PostgreSQL database'));
      return res.status(500).send({
        mensaje: `Lo sentimos, no fue posible registrar la actividad`,
      });
    }

    const activity = await db.findOne({ client, query: `SELECT * FROM ca_actividades WHERE id = ${params.id} `});

    if(activity.code !== 200) {
      return res.status(activity.code).send({
        mensaje: 'Ocurrio un error al validar la informacion'
      });
    }

    if(!activity.data){
      return res.status(400).send({
        mensaje: 'La actividad no se encuentra registrada'
      });
    }

    const formatFecha = formatDate( activity.data.fecha);
    const horaInicio = formatHour(activity.data.hora_inicio);
    const horaFin = formatHour(activity.data.hora_fin)


    return res.status(200).send({
      data: {
        id: activity.data.id,
        id_instructor: activity.data.id_instructor,
        descripcion: activity.data.descripcion,
        estatus: activity.data.estatus,
        cupo: activity.data.cupo,
        fecha: formatFecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
      }
    })
  } catch (error) {
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


async function createActivity( req, res ) {
    let client=null;

    try {
        const { body }=req;
        const val=rules.createActivity({ body })
    
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
              mensaje: `Lo sentimos, no fue posible registrar la actividad`,
            });
          }

        const actividades=await db.findOne({client, query:`SELECT * FROM ca_actividades WHERE fecha='${body.fecha.trim()}' 
                                                           AND hora_inicio='${body.hora_inicio.trim()}'`})


        if(actividades.code !== 200){
            await client.query('ROLLBACK');
            return res.status(actividades.code).send({
                mensaje:'Ocurrio un error al validar los datos'
            });
        }

        if(actividades.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje:'La fecha ya esta registrada para otra actividad'
            });
        }
        
        if (body.hora_inicio >= body.hora_fin) {
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje:"La hora de inicio no puede ser mayor o igual a la hora que finaliza la actividad"
            })  
         }

         const coachActive = await db.findOne({client, query: ` SELECT * FROM ca_usuarios WHERE id = '${body.id_instructor.trim()}' 
                                                                AND id_rol = 3 AND estatus = true `});

        if( coachActive.code !== 200) {
          await client.query('ROLLBACK')
          return res.status(coachActive.code).send({
            mensaje: 'Ocurrio un error al verificar los datos'
          });
        }
        
        if( !coachActive.data ) {
          await client.query('ROLLBACK');
          return res.status(400).send({
            mensaje: 'El instructos se encuentra inactivo o no esta registrado'
          })
        }

        const count=await db.count({client, query:'SELECT count(*) FROM ca_actividades;'})

        if(count.code !== 200){
            await client.query('ROLLBACK');
            return res.status(count.code).send({
                mensaje:'Ocurrio un error al validar los datos'
            })
        }

    
        const totalActividades = count.data ? count.data : 0;
        const idActividad = totalActividades + 1;

        const registrarActividad=await db.insert({
            client, 
            insert:'INSERT INTO ca_actividades(id, descripcion, estatus, cupo, id_instructor, hora_inicio, hora_fin, fecha ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
            values:[idActividad, body.descripcion.trim(), true, body.cupo, body.id_instructor.trim(), body.hora_inicio.trim(), body.hora_fin.trim(), body.fecha.trim()]
        });

        if(registrarActividad.code !==200){
            await client.query('ROLLBACK');
            return res.status(registrarActividad.code).send({
                mensaje:'Ocurrio un problema al registrar la actividad'
            });
        }

        if(!registrarActividad.data){
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje:'Lo sentimos, no fue posible registrar la actividad'
            });
        }

        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Se ha registrado la actividad ${body.descripcion} correctamente`,
            data:registrarActividad.data
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



async function updateActivity( req, res) {
    let client=null;

    try {  
    const { params, body }=req
    const val=rules.updateActivity({params, body})

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
              mensaje: `Lo sentimos, no fue posible actualizar los datos de la actividad`,
            });
          }

          const actividad=await db.findOne({client, query:`SELECT * FROM ca_actividades WHERE id=${params.id} `});

          if(actividad.code !== 200){
            await client.query('ROLLBACK')
            return res.status(actividad.code).send({
              mensaje:actividad.message
            });
          }

          if(!actividad.data){
            await client.query('ROLLBACK')
            return res.status(400).send({
              mensaje:'Lo sentimos, La actividad no ha sido encontrada'
            })
          }

          if(body.fecha !== actividad.data.fecha.toISOString().split('T')[0] && body.hora_inicio !==actividad.data.hora_inicio){
            console.log(body.fecha)
            console.log(actividad.data)

            const actividadesProgramadas=await db.findOne({client, query:`SELECT * FROM ca_actividades WHERE fecha='${body.fecha}' AND hora_inicio='${body.hora_inicio}'`})

            if(actividadesProgramadas.code !== 200){
                await client.query('ROLLBACK');
                return res.status(actividadesProgramadas.code).send({
                    mensaje:'Ocurrio un error al validar los datos'
                });
            }
    
            if(actividadesProgramadas.data){
                await client.query('ROLLBACK');
                return res.status(400).send({
                    mensaje:'La fecha ya esta registrada para otra actividad'
                });
            }
          }

          if (body.horaInicio >= body.horaFin) {
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje:"La hora de inicio no puede ser mayor o igual a la hora que finaliza la actividad"
            })  
         }
          

          const  updateActivity= await db.update({
            client,
            update:`UPDATE ca_actividades SET descripcion=$1, cupo=$2, id_instructor=$3, hora_inicio=$4, hora_fin=$5, fecha=$6 WHERE id=$7` ,
            values:[body.descripcion.trim(), body.cupo, body.id_instructor.trim() , body.hora_inicio.trim(), body.hora_fin.trim(), body.fecha.trim(), params.id.trim()]
          })

          if(updateActivity.code !== 200){
            await client.query('ROLLBACK');
            return res.status(updateActivity.code).send({
              mensaje:'Ocurrio un error al actualizar los datos de la actividad'
            });
          }

          if(!updateActivity.data || updateActivity.data !== 1){
            await client.query('ROLLBACK');
            return res.status('500').send({
              mensaje:'No fue posible modificar los datos de la actividad'
            });
          }

        await client.query('COMMIT');
        return res.status(200).send({
            mensaje:`Se actualizo la informacion de la actividad (${actividad.data.descripcion})`,
            data: actividad.data,
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



async function changeStatusActivity( req, res ) {
    let client=null;

    try {
        const { params }= req;
        const val= rules.changeStatusActivity({params});
        
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

        const actividad=await db.findOne({client, query:`SELECT * FROM ca_actividades WHERE  id=${params.id}`})

        if(actividad.code !==200){
          await client.query('ROLLBACK')
          return res.status(actividad.code).send({
            mensaje:'Lo sentimos, ocurrio un error al cambiar el estatus de la actividad'
          })
        }

        if(!actividad.data){
           await client.query('ROLLBACK')
            return res.status(400).send({
                mensaje:"La actividad no se encuentra registrada"
            });
        }

        const text=actividad.data.estatus ? 'deshabilitado' : 'habilitado';

        const estatus=!actividad.data.estatus;


        const changeStatusActivity= await db.update({
          client,
          update:`UPDATE ca_actividades SET estatus=$1 WHERE id=$2`,
          values:[estatus,params.id]
        })

        if(changeStatusActivity.code !== 200){
          await client.query('ROLLBACK');
          return res.status(changeStatusActivity.code).send({
            mensaje:'Ocurrio un error al cambiar el estatus de la actividad'
          });
        }

        if(!changeStatusActivity.data || changeStatusActivity.data !== 1 ){
          await client.query('ROLLBACK');
          return res.status(500).send({
            mensaje:'No fue posible cambiar el estatus de la actividad'
          });
        }

        await client.query('COMMIT')
        return res.status(200).send({
            mensaje:`Se ha ${text} de la actvidad ${actividad.data.descripcion}`,

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
  getActivity,
  getActivities,
  createActivity,
  updateActivity,
  changeStatusActivity,

}