'use strict';

const { Client } = require("pg");
const { api, develop } = require("../config/config");
const { randomUUID } = require('crypto');
const pc = require('picocolors')
const db = require('../db/index')
const rules = require('../rules/agendaActividades');
const { date } = require("check-types");



async function getAgendaActivities( req, res ) {
    let client=null;

    try {
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
              mensaje: `Lo sentimos, no fue posible mostrar la agenda de actividades`,
            });
          }

          const agendaActivities = await db.findAll({ client, query: `SELECT * FROM ca_agenda_actividades;` })

          if( agendaActivities.code !== 200 ){
            return res.status( agendaActivities.code ).send({
                mensaje: 'Ocurrio un error al consultar la agenda de actividades'
            })
          }

        return res.status(200).send({
            mensaje:`Agenda de actividades`,
            data:agendaActivities.data
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

async function getAgendaActivity( req, res ) {
    let client=null;

    try {
        const { params }=req;
        const val=rules.getAgendaActivity({ params })
    
        if(val.code !==200){
            return res.status(val.code).send({
                mensaje:val.message
            })
        };
        client=new Client(develop);
        try {
            await client.connect();
            console.log(pc.blue("Connected to PostgreSQL database"));
        }  catch (err) {
            console.log(err);
            console.error(pc.red('Error: connecting to PostgreSQL database'));
            return res.status(500).send({
              mensaje: `Lo sentimos, no fue posible mostrar la agenda de actividades`,
            });
          }

          const agendaActivities = await db.findAll({ client, query:`SELECT aa.folio, aa.asistencia, ac.descripcion, ac.fecha, ac.hora_inicio, ac.hora_fin
                                                                      FROM ca_agenda_actividades aa
                                                                      INNER JOIN ca_actividades ac
                                                                      ON aa.id_actividad = ac.id
                                                                      WHERE aa.id_usuario = '${params.id}' `});

          if( agendaActivities.code !== 200 ){
            return res.status(agendaActivities.code).send({
              mensaje:'Ocurrio un error al mostrar tus actividades'
            });
          }

          if( !agendaActivities.data){
            return res.status(400).send({
              mensaje:'No se encontraron actividades'
            })
          }

        return res.status(200).send({
            mensaje:`Agenda de actividades`,
            data:agendaActivities.data
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

async function createAgendaActivities( req, res ) {
    let client=null;

    try {
        const { body }=req;
        const val=rules.createDateActivity({ body })
    
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
              mensaje: `Lo sentimos, no fue posible crear tu cita para la actividad`,
            });
          }

          const user = await db.findOne({ client, query:`SELECT * FROM ca_usuarios WHERE id = '${body.idUsuario}' `})

          if(user.code !== 200){
            await client.query('ROLLBACK');
            return res.status(client.code).send({
              mensaje: 'Ocurrio un errror al validar la informacion'
            });
          }

          if(!user.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'El usuario no se encuentra registrado'
            });
          }
          // Verificar que el usuario cuenten con un plan

          const membershipUser = await db.findOne({ client, query:`SELECT * FROM ca_inscripciones WHERE id_usuario='${body.idUsuario}' estatus = true`})

          if(membershipUser.code !== 200){
            await client.query('ROLLBACK');
            return res.status(membershipUser.code).send({
              mensaje:'Ocurrio un error al validar la informacion'
            });
          }

          if(!membershipUser.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'El usuario no cuenta con una membresia activa'
            });
          }

          const actitividad = await db.findOne({ client, query:`SELECT * FROM ca_actividades WHERE id = '${body.idActividad}' AND estatus=true` })

          if(actitividad.code !==200){
            await client.query('ROLLBACK');
            return res.status(actitividad.code).send({
              mensaje:'Ocurrio un error al validar la informacion'
            });
          }

          if(!actitividad.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'La actividad no se encuentra registrada o esta inactiva'
            });
          }

          const countActividad = await db.count({client, query:`SELECT count(*) FROM ca_agenda_actividades WHERE id_actividad = '${body.idActividad}' `})

          if(countActividad.code !== 200){
            await client.query('ROLLBACK');
            return res.status(countActividad.code).send({
              mensaje:'Ocurrio un error al validar la informacion'
            });
          }

          if(countActividad.data >= actitividad.data.cupo){
            await client.query('ROLLBACK');
            return res.status(countActividad.data).send({
              mensaje:'Se ha alcanzado el numero limite de personas para esta actividad'
            });
          }

          const idCita = randomUUID();

          const registerDateActivity = await db.insert({
            client,
            insert:'INSERT INTO ca_agenda_actividades(folio, id_usuario, id_actividad, asistencia, estatus) VALUES($1, $2, $3, $4, $5)',
            values:[idCita, body.idUsuario, body.idActividad, 'pendiente', true],
          });







        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Agenda de actividades`,
            data: actitividad.data
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


async function updateAgendaActivity( req, res ) {
    let client=null;

    try {
        const { params, body }=req;
        const val=rules.updateDateActivity({ params, body })
    
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
              mensaje: `Lo sentimos, no fue posible editar la cita para la actividad`,
            });
          }

          const membershipUser = await db.findOne({ client, query:`SELECT * FROM ca_inscripciones WHERE id_usuario='${body.idUsuario}' estatus = true`})

          if(membershipUser.code !== 200){
            await client.query('ROLLBACK');
            return res.status(membershipUser.code).send({
              mensaje:'Ocurrio un error al validar la informacion'
            });
          }

          if(!membershipUser.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'El usuario no cuenta con una membresia activa'
            });
          }

          const dateActivity = await db.findOne({client, query:`SELECT * FROM ca_agenda_actividades WHERE folio = '${params.id}'`});

          if(dateActivity.code !== 200){
            await client.query('ROLLBACK');
            return res.status(dateActivity.code).send({
              mensaje:'Ocurrio un error al validar los datos'
            });
          }

          if(!dateActivity.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'La cita para la actividad no ha sido encontrada'
            })
          }
          
          if(body.idUsuario !== dateActivity.data.id_usuario){
              
            const user = await db.findOne({ client, query:`SELECT * FROM ca_usuarios WHERE id = '${body.idUsuario}' `})

            if(user.code !== 200){
              await client.query('ROLLBACK');
              return res.status(client.code).send({
                mensaje: 'Ocurrio un errror al validar la informacion'
              });
            }
    
            if(!user.data){
              await client.query('ROLLBACK');
              return res.status(400).send({
              mensaje:'El usuario no se encuentra registrado'
              });
            }
          }

          if(body.idActividad !== dateActivity.data.id_actividad){
            const actitividad = await db.findOne({ client, query:`SELECT * FROM ca_actividades WHERE id = '${body.idActividad}' AND estatus=true` })

            console.log(body.idActividad)
            console.log(dateActivity.data)

          if(actitividad.code !==200){
            await client.query('ROLLBACK');
            return res.status(actitividad.code).send({
              mensaje:'Ocurrio un error al validar la informacion'
            });
          }

          if(!actitividad.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'La actividad no se encuentra registrada o esta inactiva'
            });
          }

          const countActividad = await db.count({client, query:`SELECT count(*) FROM ca_agenda_actividades WHERE id_actividad = '${body.idActividad}' `})

          if(countActividad.code !== 200){
            await client.query('ROLLBACK');
            return res.status(countActividad.code).send({
              mensaje:'Ocurrio un error al validar la informacion'
            });
          }

          if(countActividad.data >= actitividad.data.cupo){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'Se ha alcanzado el numero limite de personas para esta actividad'
            });
          }

          }

          const updateDateActivity = await db.update({
            client,
            update:`UPDATE ca_agenda_actividades SET id_usuario=$1, id_actividad=$2 WHERE folio=$3`,
            values:[body.idUsuario, body.idActividad, params.id],
          })

          if(updateDateActivity.code !== 200){
            await client.query('ROLLBACK');
            return res.status(updateDateActivity.code).send({
              mensaje:'Ocurrio un error al actualizar tu cita'
            });
          }

          if(!updateDateActivity.data || updateDateActivity.data !== 1){
            await client.query('ROLLBACK');
            return res.status(updateDateActivity.code).send({
              mensaje:'Lo sentimos no se pudo actualizar tu cita'
            });
          }
  
        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Se ha actualizado la cita para tu actividad`,
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

async function updateAsistenceDate( req, res ) {
    let client=null;

    try {
        const { params, body }=req;
        const val=rules.updateAsistenceDate({ params, body })
    
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
              mensaje: `Lo sentimos, no fue posible modificar la asitencia`,
            });
          }

          const dateAgendaActivity = await db.findOne({client, query:`SELECT * FROM ca_agenda_actividades WHERE folio='${params.id}'`});

          if(dateAgendaActivity.code !== 200){
            await client.query('ROLLBACK');
            return res.status(dateAgendaActivity.code).send({
              mensaje:'Ocurrio un error al validar la datos'
            });
          }

          if(!dateAgendaActivity.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'El folio de la cita no se encuentra registrado'
            })
          }

          if (!['Confirmado', 'Ausente'].includes(body.asistencia)) {
            await client.query('ROLLBACK');
            return res.status(400).send({
              mensaje: 'Las opciones de la asistencia deben ser Confirmado o Ausente'
            });
          }

          const updateAsistencia = await db.update({
            client, 
            update:'UPDATE ca_agenda_actividades SET asistencia=$1, estatus=$2 WHERE folio=$3',
            values:[body.asistencia, false, params.id],
          })

          if(updateAsistencia.code !== 200){
            await client.query('ROLLBACK');
            return res.status(updateAsistencia.code).send({
              mensaje:'Ocurrio un error al actualizar los datos'
            });
          }

          if(!updateAsistencia.data || updateAsistencia.data !== 1){
            await client.query('ROLLBACK');
            return res.status(500).send({
              mensaje:'No se pudo actualizar la asistencia'
            });
          }

        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Se ha actualizado la asistencia`,
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


module.exports={
    getAgendaActivities,
    getAgendaActivity,
    createAgendaActivities,
    updateAgendaActivity,
    updateAsistenceDate,
}