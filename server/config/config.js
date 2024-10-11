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
    api:{
        baseEndpoint: '/api',
        errorGeneral: 'Servicio no disponible',
        errorAuthentication: 'Es requerida la autenticación para acceder a este recurso',
        errorSinAutorizacion: 'Esta cuenta no tiene acceso a este recurso',
        errorUsuarioBloqueado: 'Por motivos de seguridad su cuenta ha sido bloqueada, intente más tarde',
        errorSesionExpirada: 'Lo sentimos, su sesión ha expirado, ingrese sus credenciales de acceso',
    },
    regex:{
        fecha:{
            pattern:/^\d{4}-\d{2}-\d{2}$/
        },
        hora:{
            pattern:/^([01]\d|2[0-3]):([0-5]\d)$/
        },
        clave:{
            pattern:/^gym-\d+$/
        }
    }
}