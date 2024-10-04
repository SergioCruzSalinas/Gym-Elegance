'use strict';

const pc = require('picocolors')

//ver la agenda de actividades

async function getAgenda( req, res ) {
    console.log('ver la agenda de todas las clases')
};

//crear una cita para una actividad
async function createReserveAgenda( req, res ) {
    console.log('Reservar una clase')
};

//editar una cita para una actividad
async function updateReserveAgenda( req, res ) {
    console.log('Editar una cita')
}

//funcion para cambiar la asistencia
async function attendanceAgenda( req, res ) {
    console.log('agregar la asistencia')
}

//funcion para cambiar el estatus de cita agendada (pendiente servira para cancelar la cita)
async function statusReserveAgenda( req, res ) {
    console.log('ver la agenda de todas las clases')
}





module.exports={
    getAgenda,
    createReserveAgenda,
    updateReserveAgenda,
    attendanceAgenda,
    statusReserveAgenda,

}