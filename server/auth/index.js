'use strict'

const db = require('../db/index');
const pc = require('picocolors');
const jwt = require('jsonwebtoken');
const { secret, login, api, develop } = require('../config/config');
const { isUUID } = require('validator');
const { Client } = require('pg');
const { includes } = require('check-types');



// Funcion encargada de crear el token de sesion

function createAuth(params) {
    return jwt.sign(
        {
            iu:params.id_usuario,
            ir:params.id_rol,
        },
        secret,
        {
            expiresIn:`${login.tiempoSesion}`
        }
    );

}

// Funcion encargada de validar el token de sesion
async function validateAuth(req, res,next){ 
    let client = null;

    try {
        if(!req.headers.authorization){
            return res.status(403).send({
                err_code: 'EA-001',
                mensaje: api.errorAuthentication,
            });
        }

        const token = req.headers.authorization.replace(/^Bearer /, '').replace(/['"]+/g, '');
        console.log('token esperado', token)

        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            console.log('token esperado', token)
        } catch (err) {
            console.log(err)
            console.log(pc.yellow('Error: '), pc.red(err.message));
            return res.status(403).send({
                mensaje: api.errorSesionExpirada,
            });            
        }
        if(!decoded.iu || !isUUID(decoded.iu) || !decoded.ir){
            return res.status(403).send({
                err_code: 'EA-004',
                mensaje: api.errorSinAutorizacion
            });
        }

        client = new Client(develop);
        try {
            await client.connect();
            console.log(pc.cyan('Connected to PostgreSQL database'));
        } catch (err) {
            console.log(err);
            console.error(pc.red('Error: connecting to PostgreSQL database'));
            return res.status(500).send({
                err_code: 'EA-005',
                mensaje: 'Lo sentimos, no fue posible continuar con el proceso de autenticacion'
            });
        }

        const user = await db.count({
            client,
            query: `SELECT count(*) FROM ca_accesos WHERE id_usuario = '${decoded.iu}' AND token = '${token}' ;`
        });

        if(user.code !== 200) {
            return res.status(user.code).send({
                err_code: 'EA-006',
                mensaje: `Lo sentimos, la sesión del usuario no es válida`,
            });
        }

        req.user = {
            id: decoded.iu,
            id_rol: decoded.ir,
        };

        next();

    } catch (error) {
        console.log(error);
        console.log(pc.yellow('Error: '), pc.red(error.message));
        return res.status(401).send({
            err_code: 'EA-000',
            mensaje: api.errorAuthentication,
        });
    }finally {
        if(client){
            try {
                await client.end();
                console.log(pc.cyan('Connection to PostgreSQL closed'));
            } catch (error) {
                console.log(error)
                console.log(pc.red('Error closing connection'));
                
            }

        }
    }

}

// Funcion encargada de la autorizacion de los roles

const authorizeRole = (roles) => {
    return (req, res, next) => {
        const { id_rol } = req.user;

        console.log('role*****', id_rol)
        console.log('roles_________', roles)

        if( !roles.includes(id_rol)){
            return res.status(403).send({
                 err_code: 'EA-003',
                 mensaje: 'No tienes permiso para acceder a este recurso'
            });
        }

        next();
    }
}


module.exports = {
    createAuth,
    validateAuth,
    authorizeRole,
}