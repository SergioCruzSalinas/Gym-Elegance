'use strict';

const { Client } = require('pg');
const db = require('../db/index');
const { develop, plataforma, api } = require('../config/config');
const { randomUUID, createHash } = require('crypto');
const { query } = require('express');
const pc = require('picocolors')
const { registerMembership } = require('../controllers/utils'); // Importar la función correctamente

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