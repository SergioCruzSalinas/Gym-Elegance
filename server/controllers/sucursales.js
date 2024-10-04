'use strict';

const pc = require('picocolors')

//ver las sucursales

async function getSities( req, res ) {
    console.log('ver las sucursales')
}



//Agregar una sucursal

async function createPlace( req ,res ) {
    console.log('agregar un nuevo gymnasio')
    
}


//editar una sucursal

async function updatePlace( req ,res ) {
    console.log('agregar un nuevo gymnasio')
    
}


//Cambiar el estatus de una sucursal

async function statusPlace( req, res ) {
    console.log('Cambiar el estatus de un gymnasio')
    
}



module.exports={
    getSities,
    createPlace,
    updatePlace,
    statusPlace,
}


// propiedades de la tabla sucursal

// folio varchar
// nombre varchar 
// direccion text