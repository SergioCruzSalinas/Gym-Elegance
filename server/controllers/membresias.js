'use strict';

const pc = require('picocolors')
const db=require('../db/index')

const rules= require('../rules/membresias')
const Client = require('pg/lib/client');
const { develop, plataforma, api } = require('../config/config');
const { randomUUID, createHash } = require('crypto');


//ver los usuarios

async function getMemberships( req, res ) {
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

        const membresias=await db.findAll({client, query:'SELECT * FROM ca_membresias'})

        if(membresias.code !==200){
            return res.status(membresias.code).send({
                mensaje:"Ocurrio un error al mostrar las membresias"
            });
        }

        if(!membresias.data){
          return res.status(400).send({
            mensaje:'No se encuentran membresias registradas'
          })
        }

        return res.status(200).send({
            mensaje:"membresias: ",
            data:membresias.data
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

async function createMembership( req, res ) {
    let client=null;

    try {
        const { body }=req;
        const val=rules.createMembership({ body })
    
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
              mensaje: `Lo sentimos, no fue posible registrar la membresia`,
            });
          }

        const membresia=await db.findOne({client, query:`SELECT * FROM ca_membresias WHERE tipo='${body.tipo}' `})
        if(membresia.code !== 200){
            await client.query('ROLLBACK');
            return res.status(membresia.code).send({
                mensaje:'Ocurrio un error al validar los datos'
            });
        }

        if(membresia.data){
            await client.query('ROLLBACK');
            return res.status(400).send({
                mensaje:'El nombre de la membresia ya se encuentra registrada'
            });
        }

        const count=await db.count({client, query:'SELECT count(*) FROM ca_membresias'})

        if(count.code !== 200){
            await client.query('ROLLBACK');
            return res.status(count.code).send({
                mensaje:'Ocurrio un error al validar los datos'
            })
        }

    
        if(!count.data){
           const idMembresia=1
        }

         const idMembresia=count.data+1;

        const registrarMembresia=await db.insert({
            client, 
            insert:'INSERT INTO ca_membresias(id, tipo, descripcion, precio, mes_duracion, dias_duracion ) VALUES($1, $2, $3, $4, $5, $6)',
            values:[idMembresia, body.tipo, body.descripcion, body.precio, body.mesDuracion, body.diasDuracion]
        });

        if(registrarMembresia.code !==200){
            await client.query('ROLLBACK');
            return res.status(registrarMembresia.code).send({
                mensaje:'Ocurrio un problema al registrar la membresia'
            });
        }

        if(!registrarMembresia.data){
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje:'Lo sentimos, no fue posible registrar la membresia'
            });
        }

        await client.query('COMMIT');

        return res.status(200).send({
            mensaje:`Se ha registrado el plan ${body.tipo} correctamente`,
            data:registrarMembresia.data
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

async function updateMembership( req, res) {
    let client=null;

    try {  
    const { params, body }=req
    const val=rules.updateMembership({params, body})

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
              mensaje: `Lo sentimos, no fue posible actualizar la membresia`,
            });
          }

          const membresia=await db.findOne({client, query:`SELECT * FROM ca_membresias WHERE id=${params.id} `});

          if(membresia.code !== 200){
            await client.query('ROLLBACK')
            return res.status(membresia.code).send({
              mensaje:membresia.message
            });
          }

          if(!membresia.data){
            await client.query('ROLLBACK')
            return res.status(400).send({
              mensaje:'Lo sentimos, el plan no ha sido encontrado'
            })
          }

          const  updateMembership= await db.update({
            client,
            update:`UPDATE ca_membresias SET tipo=$1, descripcion=$2, precio=$3, mes_duracion=$4, dias_duracion=$5 WHERE id=$6` ,
            values:[body.tipo, body.descripcion, body.precio, body.mesDuracion, body.diasDuracion, membresia.data.id]
          })

          if(updateMembership.code !== 200){
            await client.query('ROLLBACK');
            return res.status(updateMembership.code).send({
              mensaje:'Ocurrio un error al actualizar los del plan'
            });
          }

          if(!updateMembership.data || updateMembership.data !== 1){
            await client.query('ROLLBACK');
            return res.status('500').send({
              mensaje:'No fue posible modificar los datos del plan'
            });
          }

        await client.query('COMMIT');
        return res.status(200).send({
            mensaje:`Se actualizo la informacion del plan (${membresia.data.tipo})`,
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

//Cambiar el status de la membresia

async function changeStatusMemberships(req, res) {
  let client=null;

    try {
        const { params }= req;
        const val= rules.changeStatusMemberships({params});
        
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
              mensaje: `Lo sentimos, no fue posible cambiar el estatus de la membresia`,
            });
          }

        const membresia=await db.findOne({client, query:`SELECT * FROM ca_membresias WHERE  id=${params.id}`})

        if(membresia.code !==200){
          await client.query('ROLLBACK')
          return res.status(membresia.code).send({
            mensaje:'Lo sentimos, ocurrio un error al cambiar el estatus de la membresia'
          })
        }

        if(!membresia.data){
           await client.query('ROLLBACK')
            return res.status(400).send({
                mensaje:"La membresia no se encuentra registrada"
            });
        }

        const text=membresia.data.estatus ? 'deshabilitado' : 'habilitado';

        const estatus=!membresia.data.estatus;


        const changeStatusMemberships= await db.update({
          client,
          update:`UPDATE ca_membresias SET estatus=$1 WHERE id=$2`,
          values:[estatus,params.id]
        })

        if(changeStatusMemberships.code !== 200){
          await client.query('ROLLBACK');
          return res.status(changeStatusActivity.code).send({
            mensaje:'Ocurrio un error al cambiar el estatus de la membresia'
          });
        }

        if(!changeStatusMemberships.data || changeStatusMemberships.data !== 1 ){
          await client.query('ROLLBACK');
          return res.status(500).send({
            mensaje:'No fue posible cambiar el estatus de la membresia'
          });
        }

        await client.query('COMMIT')
        return res.status(200).send({
            mensaje:`Se ha ${text} de la membresia ${membresia.data.tipo}`,

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
    getMemberships,
    createMembership,
    updateMembership,
    changeStatusMemberships,


}