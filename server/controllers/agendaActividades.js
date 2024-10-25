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
            await client.query('BEGIN');
            console.log(pc.yellow('Transaction started'));
        }  catch (err) {
            console.log(err);
            console.error(pc.red('Error: connecting to PostgreSQL database'));
            return res.status(500).send({
              mensaje: `Lo sentimos, no fue posible mostrar la agenda de actividades`,
            });
          }

          const agendaActivities = await db.findAll({ client, query:`SELECT * FROM ca_agenda_actividades WHERE id_usuario = '${params.id}' ` })




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

async function createAgendaActivities( req, res ) {
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
              mensaje: `Lo sentimos, no fue posible crear tu cita para la actividad`,
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