'use strict';

const { Client } = require('pg');
const db = require('../db/index');
const { develop, plataforma, api } = require('../config/config');
const { randomUUID, createHash } = require('crypto');
const { query } = require('express');
const pc = require('picocolors')
const { registerMembership, registerActivity } = require('../controllers/utils'); // Importar la función correctamente

async function insertDataBase(req, res) {
    let client = null;

    try {
        client = new Client(develop);
        await client.connect();
        console.log(pc.blue('Connected to PostgreSQL database'));
        await client.query('BEGIN');
        console.log(pc.yellow('Transaction started'));

        // Agregar roles
        const createRolRoot = await db.insert({
            client,
            insert: 'INSERT INTO ca_roles(id, orden, descripcion) VALUES($1, $2, $3)',
            values: [plataforma.roles.root, plataforma.roles.root, 'Root']
        });

        const createRolAdmin = await db.insert({
            client,
            insert: 'INSERT INTO ca_roles(id, orden, descripcion) VALUES($1, $2, $3)',
            values: [plataforma.roles.admin, plataforma.roles.root, 'Admin']
        });

        const createRolCoach = await db.insert({
            client,
            insert: 'INSERT INTO ca_roles(id, orden, descripcion) VALUES($1, $2, $3)',
            values: [plataforma.roles.instructor, plataforma.roles.root, 'Instructor']
        });

        const createRolUser = await db.insert({
            client,
            insert: 'INSERT INTO ca_roles(id, orden, descripcion) VALUES($1, $2, $3)',
            values: [plataforma.roles.usuario, plataforma.roles.root, 'Usuario']
        });

        // Verificar si hubo algún error en la inserción de roles
        if (createRolRoot.code !== 200 || createRolAdmin.code !== 200 || createRolCoach.code !== 200 || createRolUser.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje: 'Ocurrió un error al ingresar los datos'
            });
        }

        // Agregar admin
        const idAdmin = randomUUID();
        const createAdmin = await db.insert({
            client,
            insert: 'INSERT INTO ca_usuarios(id, id_rol, nombre, telefono) VALUES($1, $2, $3, $4)',
            values: [idAdmin, plataforma.roles.admin, "Sergio Cruz Salinas", '5565823491']
        });

        if (createAdmin.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(createAdmin.code).send({
                mensaje: 'Ocurrió un error al agregar los datos del admin'
            });
        }
        // Agregar admin a accesos
        const idAccessAdmin = randomUUID();
        const passwordAdmin = "Chimi10";
        const passwordEncrypted = createHash('sha256').update(passwordAdmin).digest('base64');

        const createAccessAdmin = await db.insert({
            client,
            insert: 'INSERT INTO ca_accesos(id, id_usuario, correo_electronico, contrasenia) VALUES($1, $2, $3, $4)',
            values: [idAccessAdmin, idAdmin, "sercru4414@gmail.com", passwordEncrypted]
        });

        if (createAccessAdmin.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje: 'Ocurrió un error al agregar los datos de acceso del admin'
            });
        }

        // Agregar instructor

        const idCoach = randomUUID();
        const createCoach = await db.insert({
            client,
            insert:'INSERT INTO ca_usuarios(id, id_rol, nombre, telefono) VALUES($1, $2, $3, $4)',
            values:[idCoach, plataforma.roles.instructor, "Carlos Instructor", "5565423158"],
        });

        if( createCoach.code !== 200 ){
            await client.query('ROLLBACK');
            return res.status(createCoach.code).send({
                mensaje:'Ocurrio un error al agregar los datos del instructor'
            })
        }

        // Agregar los accesos para instructor
        const idAccessCoach = randomUUID();
        const passwordCoach = "Constrasenia";
        const passwordEncryptedCoach = createHash('sha256').update(passwordCoach).digest('base64');
      
        const createAccessCoach = await db.insert({
            client,
            insert: 'INSERT INTO ca_accesos(id, id_usuario, correo_electronico, contrasenia) VALUES($1, $2, $3, $4)',
            values: [idAccessCoach, idCoach, "instructor@gmail.com", passwordEncryptedCoach]
        });
      
        if (createAccessCoach.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje: 'Ocurrió un error al agregar los datos de acceso del admin'
        });          
        }

             // Agregar admin
             const idUser = randomUUID();
             const createUser = await db.insert({
                 client,
                 insert: 'INSERT INTO ca_usuarios(id, id_rol, nombre, telefono) VALUES($1, $2, $3, $4)',
                 values: [idUser, plataforma.roles.usuario, "Usuario 1", '5665135495']
             });
     
             if (createUser.code !== 200) {
                 await client.query('ROLLBACK');
                 return res.status(createAdmin.code).send({
                     mensaje: 'Ocurrió un error al agregar los datos del usuario'
                 });
             }
             // Agregar admin a accesos
             const idAccessUser = randomUUID();
             const passwordUser = "Usuario1";
             const passwordEncryptedUser = createHash('sha256').update(passwordUser).digest('base64');
     
             const createAccessUser = await db.insert({
                 client,
                 insert: 'INSERT INTO ca_accesos(id, id_usuario, correo_electronico, contrasenia) VALUES($1, $2, $3, $4)',
                 values: [idAccessUser, idUser, "usuario1@gmail.com", passwordEncryptedUser]
             });
     
             if (createAccessUser.code !== 200) {
                 await client.query('ROLLBACK');
                 return res.status(500).send({
                     mensaje: 'Ocurrió un error al agregar los datos de acceso del admin'
                 });
             }

        // Agregar membresías
        const resultVisita = await registerMembership(client, 'visita', 1, 0, 'Acceso a cualquier actividad y gimnasio por un día', 70);
        const resultBasico = await registerMembership(client, 'plan basico', 0, 1, 'Acceso a las actividades y gimnasio sin coach personal', 500);
        const resultSemiPersonal = await registerMembership(client, 'plan semi-personal', 1, 0, 'Acceso a cualquier actividad y gimnasio con asesoramiento personal', 1200);

        if (resultVisita.code !== 200 || resultBasico.code !== 200 || resultSemiPersonal.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje: 'Ocurrió un error al registrar las membresías'
            });
        }

        // agregar Actividades

        const activityGymPersonal = await registerActivity(client, "Gym con Coach personal", true, 1, idCoach, "2025-06-22", "17:00", "19:00");
        const activityGym = await registerActivity(client, "Gym", true, 1, idCoach, null, null, null);
        const activityBox = await registerActivity(client, "Acondicionamiento y Box", true, 6, idCoach, "2025-06-22", "10:00", "11:30");
        const activityZumba = await registerActivity(client, "Clases de Zumba", true, 10, idCoach, "2025-06-22", "15:00", "16:00");

        if( activityGymPersonal.code !== 200 || activityGym.code !== 200 || activityBox.code !== 200 || activityZumba.code !== 200){
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje: 'Ocurrio un error al registrar las actividades'
            });
        }

        // Confirmar la transacción
        await client.query('COMMIT');

        return res.status(200).send({
            mensaje: 'Se agregaron los datos correctamente'
        });
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


module.exports = {
    insertDataBase
};






module.exports={
    insertDataBase,
}