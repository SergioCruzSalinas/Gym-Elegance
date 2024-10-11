'use strict';

const { regex } = require("../config/config");
const check = require('check-types');


function createActivity({body}){
    const regexfecha= new RegExp(regex.fecha.pattern);
    const regexHora= new RegExp(regex.hora.pattern);

    const result={
        code:200,
        message:''
    };

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

    if(!body.horaInicio  || !check.string(body.horaInicio)){
        result.code=400;
        result.message='Ingrese la hora en la que inicia la actividad';
        return result;
    }

    if(!regexHora.test(body.horaInicio)){
        result.code=400;
        result.message='El formato de la hora deber ser HH:MM y uso de las 24 hrs.';
        return result;
    }

    
    if(!body.horaFin  || !check.string(body.horaFin)){
        result.code=400;
        result.message='Ingrese la hora en la que finaliza la actividad';
        return result;
    }

    if(!regexHora.test(body.horaFin)){
        result.code=400;
        result.message='El formato de la hora deber ser HH:MM y uso de las 24 hrs.';
        return result;
    }

    if(!body.fecha || !check.string(body.fecha)){
        result.code=400;
        result.message='Se requiere la fecha de la actividad';
        return result;
    }

    if(!regexfecha.test(body.fecha)){
        result.code=400;
        result.message='El formato de la fecha debe ser YYYY-MM-DD';
        return result;
    }

    return result;
}

function updateActivity({params, body}){
    const regexfecha= new RegExp(regex.fecha.pattern);
    const regexHora= new RegExp(regex.hora.pattern);

    const result={
        code:200,
        message:''
    };

    if(!params.id){
        result.code=400;
        result.message='Se requiere el id de la actrividad para continuar'
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

    if(!body.horaInicio  || !check.string(body.horaInicio)){
        result.code=400;
        result.message='Ingrese la hora en la que inicia la actividad';
        return result;
    }

    if(!regexHora.test(body.horaInicio)){
        result.code=400;
        result.message='El formato de la hora deber ser HH:MM y uso de las 24 hrs.';
        return result;
    }

    
    if(!body.horaFin  || !check.string(body.horaFin)){
        result.code=400;
        result.message='Ingrese la hora en la que finaliza la actividad';
        return result;
    }

    if(!regexHora.test(body.horaFin)){
        result.code=400;
        result.message='El formato de la fecha deber ser HH:MM y uso de las 24 hrs.';
        return result;
    }

    if(!body.fecha || !check.string(body.fecha)){
        result.code=400;
        result.message='Se requiere la fecha de la actividad';
        return result;
    }

    if(!regexfecha.test(body.fecha)){
        result.code=400;
        result.message='El formato de la fecha debe ser YYYY-MM-DD';
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
    createActivity,
    updateActivity,
    changeStatusActivity,
}