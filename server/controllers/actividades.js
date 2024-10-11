'use strict';

const pc = require('picocolors')
const db=require('../db/index')

const rules= require('../rules/actividades')
const Client = require('pg/lib/client');
const { develop, plataforma, api } = require('../config/config');

//Notas: falta hacer la paginacion y cambiar el tipo de dato de la fecha para que solo muestre la fecha en la base de datos


//ver los usuarios

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
            mensaje:"Actividades: ",
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


//crear un usuario (acabado)

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

        const actividades=await db.findOne({client, query:`SELECT * FROM ca_actividades WHERE fecha='${body.fecha}' AND hora_inicio='${body.horaInicio}'`})


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
        
        if (body.horaInicio >= body.horaFin) {
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje:"La hora de inicio no puede ser mayor o igual a la hora que finaliza la actividad"
            })  
         }

        const count=await db.count({client, query:'SELECT count(*) FROM ca_actividades;'})

        if(count.code !== 200){
            await client.query('ROLLBACK');
            return res.status(count.code).send({
                mensaje:'Ocurrio un error al validar los datos'
            })
        }

    
        if(!count.data){
           const idActividad=1
        }

         const idActividad=count.data+1;

        const registrarActividad=await db.insert({
            client, 
            insert:'INSERT INTO ca_actividades(id, descripcion, estatus, cupo, hora_inicio, hora_fin, fecha ) VALUES($1, $2, $3, $4, $5, $6, $7)',
            values:[idActividad, body.descripcion, true, body.cupo, body.horaInicio, body.horaFin, body.fecha]
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

//editar un usuario

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

          if(body.fecha !== actividad.data.fecha && body.horaInicio !==actividad.data.hora_inicio){

            const actividadesProgramadas=await db.findOne({client, query:`SELECT * FROM ca_actividades WHERE fecha='${body.fecha}' AND hora_inicio='${body.horaInicio}'`})

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
            update:`UPDATE ca_actividades SET descripcion=$1, cupo=$2, hora_inicio=$3, hora_fin=$4, fecha=$5 WHERE id=$6` ,
            values:[body.descripcion, body.cupo, body.horaInicio, body.horaFin, body.fecha, params.id]
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
    getActivities,
    createActivity,
    updateActivity,
    changeStatusActivity,


}