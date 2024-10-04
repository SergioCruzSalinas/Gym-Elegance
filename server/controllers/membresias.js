'use strict'

const pc= require('picocolors')

//funcion para ver las membresias

async function getMemberships( req, res ) {

    console.log('Ver membresias')
    
};

//funcion para agregar una membresia
async function createMemberships( req, res) {
    console.log('crear usuario')
    
};


//funcion para editar una membresia

async function updateMemberships( req, res ) {
    console.log('actualizar membresia')
    
};

//funcion para eliminar una membresia
async function deleteMemberships(params) {
    console.log('eliminar membresia')
    
}


module.exports={
    getMemberships,
    createMemberships,
    updateMemberships,
    deleteMemberships,

}