'use strict';

const pc = require('picocolors')

// Funcion para ver los entrenadores

async function getCoachs(req,res){

    console.log(pc.bgWhite(pc.black('GET request a /actividades')));
        res.status(200).send('Hola desde la ruta de actividades');
};

// Funcion para crear un instructor
async function createCoach( req, res ) {
    console.log('crear coach')
};


// Editar la informacion de un instructor
async function updateCoach( req, res) {
    console.log('Editar la informacion del coach')    
};

async function deleteCoach( req, res ) {
    console.log('eliminar un coach')
    
};

module.exports={
    getCoachs,
    createCoach,
    updateCoach,
    deleteCoach,
};