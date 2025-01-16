'use strict';

module.exports={
    develop:{
        host:'localhost',
        port:5432,
        user:'postgres',
        password:'Chimi10',
        database:'dbgym'
    },
    plataforma:{
        nombre:'Inscripciones',
        roles:{
            root:1,
            admin:2,
            instructor:3,
            usuario:4
        },
        numRegistrosPorPagina:10,
    },
    secret: process.env.TOKEN_SECRET,
    api:{
        baseEndpoint: '/api',
        errorGeneral: 'Servicio no disponible',
        errorAuthentication: 'Es requerida la autenticación para acceder a este recurso',
        errorSinAutorizacion: 'Esta cuenta no tiene acceso a este recurso',
        errorUsuarioBloqueado: 'Por motivos de seguridad su cuenta ha sido bloqueada, intente más tarde',
        errorSesionExpirada: 'Lo sentimos, su sesión ha expirado, ingrese sus credenciales de acceso',
    },
    date: {
        format: {
          in: 'YYYY-MM-DD',
          out: 'DD/MM/YYYY',
          outF: 'DD/MM/YYYY[ ]HH:mm[ h.]',
        },
        timeZone: 'America/Mexico_City',
    },
    login: {
        numeroIntentos: 3,
        tiempoSesion: '1h',
        tiempoBloqueo: 60,
        tiempoRestablecerContrasenia: 15,
    },
    regex:{
        fecha:{
            pattern:/^\d{4}-\d{2}-\d{2}$/
        },
        hora:{
            pattern:/^(\d{2}):(\d{2}):(\d{2})$/ 
        },
        clave:{
            pattern:/^gym-\d+$/
        },
    }
}