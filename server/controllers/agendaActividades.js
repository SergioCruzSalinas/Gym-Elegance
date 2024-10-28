'use strict';

const { Client } = require("pg");
const { api, develop } = require("../config/config");
const pc = require('picocolors')
const db = require('../db/index')
const rules = require('../rules/agendaActividades')


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

          const agendaActivities = await db.findAll({ client, query:`SELECT * FROM ca_agenda_actividades WHERE id_usuario = '${params.id}' `});

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

          const membresiaActiva = await db.findOne({ client, query:`SELECT * FROM rel_inscripciones WHERE id_usuario = '${body.idUsuario}' AND estatus=true`})
          
          if(membresiaActiva.code !== 200){
            client.query('ROLLBACK');
            return res.status( membresiaActiva.code).send({
              mensaje:'Ocurrio un error al validar los datos'
            })
          }

          if(!membresiaActiva.data){
            client.query('ROLLBACK');
            return res.status( membresiaActiva.code).send({
              mensaje:'No se puede realizar un cita ya que no esta inscrito a un plan'
            })
          }

          const actividad = db.findOne({ client, query:`SELECT * FROM ca_actividades WHERE id_actividad=${body.idActividad} AND estatus=true`})

          if( actividad !== 200){
            client.query('ROLLBACK');
            return res.status( actividad.code).send({
              mensaje:'Ocurrio un error al validar los datos'
            });
          }

          if( !actividad.data){
            client.query('ROLLBACK');
            return res.status(400).send({
              mensaje:'La actividad no se encuentra registrada o esta inactiva'
            })
          }

          



        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Agenda de actividades`,
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
              mensaje: `Lo sentimos, no fue posible editar la cita para la actividad`,
            });
          }

        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Agenda de actividades`,
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
              mensaje: `Lo sentimos, no fue posible mostrar la agenda de actividades`,
            });
          }

        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Agenda de actividades`,
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