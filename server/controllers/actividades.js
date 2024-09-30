'use strict';

const pc = require('picocolors')

// Funcion para ver las actividades

function getActivities(req,res){

    console.log(pc.bgWhite(pc.black('GET request a /actividades')));
        res.status(200).send('Hola desde la ruta de actividades');
}

//funcion para crear una actividad

function createActvities(req, res){
    console.log(pc.bgWhite(pc.black('peticion para crear una actividad')))
}

//Funcion para editar una actividad


//funcion para eliminar una actividad




module.exports={
    getActivities,
    createActvities,

}