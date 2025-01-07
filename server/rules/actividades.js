'use strict';

const { isUUID } = require("validator");
const { regex } = require("../config/config");
const check = require('check-types');


function getActivity({params}) {
    const result = {
        code: 200,
        message: ''
    }

    if(!params.id){
        result.code = 400;
        result.message = 'Se requiere el id de la actividad para continuar'
        return result;
    }

    if(!Number(params.id)){
        result.code = 400;
        result.message = 'El formato del id es incorrecto'
        return result;
    }

    return result;
}

function createActivity({body}){
    const regexFecha = new RegExp(regex.fecha.pattern);
    const regexHora = new RegExp(regex.hora.pattern)
    
    const result={
        code:200,
        message:''
    };

    if(!body.id_instructor || !check.string(body.id_instructor || !isUUID(body.id_instructor))){
        result.code=400;
        result.message='Se requiere el id del instructor';
        return result
    }

    if(!body.descripcion || !check.string(body.descripcion)){
        result.code=400;
        result.message='Se requiere el nombre de la actividad'
        return result;
    }

    if(!body.cupo || !Number.isInteger(body.cupo)){
        result.code=400;
        result.message='Ingrese el numero limite de personas de la actividad como un numero entero';
        return result;
    }

    if(!body.fecha){
        result.code = 400;
        result.message= 'Se requiere la fecha de la cita'
        return result
    }

    if(!regexFecha.test(body.fecha)){
        result.code = 400;
        result.message= 'El formato de la fecha debe ser YYYY-MM-DD'
        return result
    }

    if(!body.hora_inicio  || !check.string(body.hora_inicio)){
        result.code=400;
        result.message='Ingrese la hora en la que inicia la actividad';
        return result;
    }

    if(!regexHora.test(body.hora_inicio)){
        result.code=400;
        result.message='El formato de la hora deber ser HH:MM y uso de las 24 hrs.';
        return result;
    }

    
    if(!body.hora_fin  || !check.string(body.hora_fin)){
        result.code=400;
        result.message='Ingrese la hora en la que finaliza la actividad';
        return result;
    }

    if(!regexHora.test(body.hora_fin)){
        result.code=400;
        result.message='El formato de la hora deber ser HH:MM y uso de las 24 hrs.';
        return result;
    }

    return result;
}

function updateActivity({params, body}){
    const regexFecha= new RegExp(regex.fecha.pattern);
    const regexHora= new RegExp(regex.hora.pattern);

    const result={
        code:200,
        message:''
    };

    if(!params.id){
        result.code=400;
        result.message='Se requiere el id de la actividad para continuar'
        return result
    }

    if(!body.id_instructor || !check.string(body.id_instructor || !isUUID(body.id_instructor))){
        result.code=400;
        result.message='Se requiere el id del instructor';
        return result
    }

    if(!body.descripcion || !check.string(body.descripcion)){
        result.code=400;
        result.message='Se requiere el nombre de la actividad'
        return result;
    }

    if(!body.cupo || !Number.isInteger(body.cupo)){
        result.code=400;
        result.message='Ingrese el numero limite de personas de la actividad como un numero entero';
        return result;
    }

    if(!body.fecha){
        result.code = 400;
        result.message= 'Se requiere la fecha de la cita'
        return result
    }

    if(!regexFecha.test(body.fecha)){
        result.code = 400;
        result.message= 'El formato de la fecha debe ser YYYY-MM-DD'
        return result
    }

    if(!body.hora_inicio  || !check.string(body.hora_inicio)){
        result.code=400;
        result.message='Ingrese la hora en la que inicia la actividad';
        return result;
    }

    if(!regexHora.test(body.hora_inicio)){
        result.code=400;
        result.message='El formato de la hora deber ser HH:MM y uso de las 24 hrs.';
        return result;
    }

    
    if(!body.hora_fin  || !check.string(body.hora_fin)){
        result.code=400;
        result.message='Ingrese la hora en la que finaliza la actividad';
        return result;
    }

    if(!regexHora.test(body.hora_fin)){
        result.code=400;
        result.message='El formato de la hora deber ser HH:MM y uso de las 24 hrs.';
        return result;
    }

    return result;
    

}

function changeStatusActivity({params}){
    const result={
        code:200,
        message:''
    };

    if(!params.id){
        result.code=400;
        result.message='Se requiere el id de la actividad para continuar';
        return result;
    }

    return result;

}


module.exports={
    getActivity,
    createActivity,
    updateActivity,
    changeStatusActivity,
}