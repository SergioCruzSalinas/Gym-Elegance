'use strict';

const pc = require('picocolors')


async function createSession( req ,res ) {
    console.log('crear sesion')
    
}


async function closeSession( req ,res ) {
    console.log('cerrar sesion')
    
}

async function recoveryPassword( req ,res ) {
    console.log('recuperar contraseña')
    
}

async function restorePassword( req ,res ) {
    console.log('restablecer contraseña')
    
}

async function changePassword( req, res) {
    console.log('cambiar contraseña')
    
}

module.exports={
    createSession,
    closeSession,
    recoveryPassword,
    restorePassword,
    changePassword,
}




