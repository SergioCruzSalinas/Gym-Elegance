'use strict';

const { Client } = require('pg');
const db = require('../db/index');
const { develop, plataforma, api } = require('../config/config');
const { randomUUID, createHash } = require('crypto');
const { query } = require('express');
const pc = require('picocolors');
const { registerMembership, registerActivity } = require('../controllers/utils'); // Importar la función correctamente

async function insertDataBase(req, res) {
    let client = null;

    try {
        client = new Client(develop);
        await client.connect();
        console.log(pc.blue('Connected to PostgreSQL database'));
        await client.query('BEGIN');
        console.log(pc.yellow('Transaction started'));

        // Crear tablas si no existen
        await client.query(`
            CREATE TABLE IF NOT EXISTS ca_roles(
                id SERIAL PRIMARY KEY NOT NULL,
                orden INT NOT NULL,
                descripcion VARCHAR(50) NOT NULL,
                estatus BOOLEAN DEFAULT true NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS ca_usuarios(
                id UUID PRIMARY KEY NOT NULL,
                id_rol INT NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                telefono VARCHAR(25) NOT NULL,
                estatus BOOLEAN DEFAULT true NOT NULL,
                CONSTRAINT ca_usuarios_id_rol_fkey FOREIGN KEY (id_rol)
                    REFERENCES ca_roles (id)
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS ca_accesos (
                id UUID PRIMARY KEY NOT NULL,  
                id_usuario UUID NOT NULL,
                correo_electronico VARCHAR(255) NOT NULL,
                contrasenia VARCHAR(255) NOT NULL,
                numero_intentos INTEGER DEFAULT 0 NOT NULL,
                token VARCHAR(255),
                fecha_token TIMESTAMP WITH TIME ZONE,
                fecha_bloqueo TIMESTAMP WITH TIME ZONE,
                CONSTRAINT ca_accesos_id_usuario_fkey FOREIGN KEY (id_usuario)
                    REFERENCES ca_usuarios (id)
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS ca_membresias (
                id INT PRIMARY KEY NOT NULL,
                tipo VARCHAR(255) NOT NULL,
                dias_duracion INT NOT NULL,
                mes_duracion INT NOT NULL,
                descripcion TEXT NOT NULL,
                precio DOUBLE PRECISION NOT NULL,
                estatus BOOLEAN DEFAULT true NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS rel_inscripciones (
                id VARCHAR PRIMARY KEY NOT NULL,
                id_usuario UUID NOT NULL,
                id_membresia INT NOT NULL,
                estatus BOOLEAN NOT NULL,
                fecha_inicio DATE NOT NULL,
                fecha_expiracion DATE NOT NULL,
                CONSTRAINT rel_inscripciones_id_usuario_fkey FOREIGN KEY (id_usuario)  
                    REFERENCES ca_usuarios (id)
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION,
                CONSTRAINT rel_inscripciones_id_membresia_fkey FOREIGN KEY (id_membresia) 
                    REFERENCES ca_membresias (id)
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS ca_actividades (
                id INT PRIMARY KEY NOT NULL,
                id_instructor UUID NOT NULL,
                descripcion TEXT NOT NULL,
                estatus BOOLEAN NOT NULL,
                cupo INT NOT NULL,
                fecha DATE,
                hora_inicio TIME,
                hora_fin TIME,
                CONSTRAINT ca_actividades_id_instructor_fkey FOREIGN KEY (id_instructor)
                    REFERENCES ca_usuarios (id)
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS ca_agenda_actividades (
                folio UUID PRIMARY KEY NOT NULL,
                id_usuario UUID NOT NULL,
                id_actividad INT NOT NULL,
                asistencia VARCHAR(255) NOT NULL,
                estatus VARCHAR(255) NOT NULL,
                CONSTRAINT ca_actividades_id_actividad_fkey FOREIGN KEY (id_actividad)
                    REFERENCES ca_actividades (id)
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION,
                CONSTRAINT rel_inscripciones_id_usuario_fkey FOREIGN KEY (id_usuario)
                    REFERENCES ca_usuarios (id)
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
            );
        `);

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
            insert: 'INSERT INTO ca_usuarios(id, id_rol, nombre, telefono) VALUES($1, $2, $3, $4)',
            values: [idCoach, plataforma.roles.instructor, "Carlos Instructor", "5565423158"],
        });

        if (createCoach.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(createCoach.code).send({
                mensaje: 'Ocurrio un error al agregar los datos del instructor'
            });
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

        // Agregar usuario
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
        const resultSemiPersonalizado = await registerMembership(client, 'plan semi-personalizado', 3, 3, 'Acceso a actividades y gimnasio con 3 sesiones a la semana de coach personal', 800);
        const resultPersonalizado = await registerMembership(client, 'plan personalizado', 3, 6, 'Acceso a actividades y gimnasio con 5 sesiones a la semana de coach personal', 1200);

        if (resultVisita.code !== 200 || resultBasico.code !== 200 || resultSemiPersonalizado.code !== 200 || resultPersonalizado.code !== 200) {
            await client.query('ROLLBACK');
            return res.status(500).send({
                mensaje: 'Ocurrió un error al agregar las membresías'
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

        await client.query('COMMIT');
        console.log(pc.green('Transaction completed'));
        res.send({ mensaje: 'Base de datos configurada con éxito' });

    } catch (err) {
        console.log(err);
        if (client) {
            await client.query('ROLLBACK');
        }
        res.status(500).send({ mensaje: 'Error interno del servidor' });
    } finally {
        if (client) {
            await client.end();
        }
    }
}

module.exports = { insertDataBase };
