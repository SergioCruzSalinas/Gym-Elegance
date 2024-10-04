'use strict';

const pc = require('picocolors')


//ver todas las inscripciones

async function getInscripciones( req, res ) {
    console.log('ver las incripciones')
}

//ver una inscripcion

async function getInscripcion( req, res ) {
    console.log('ver una inscripcion ')
}

//crear una inscripcion

async function createInscripcion( req, res ) {
    console.log('Crear unna inscripcio')
}

//editar una inscripcion

async function updateInscripcion( req, res ) {
    console,log('actualizar una inscripcion')
    
}

//dar de baja un inscripcion
async function deleteInscripcion( req, res ) {
    console.log('Dar de baja una inscripcion')
}

module.exports={
    getInscripciones,
    getInscripcion,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,

}