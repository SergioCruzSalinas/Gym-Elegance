const check = require("check-types");
const { isUUID } = require("validator");
const { plataforma, regex } = require("../config/config");



function getAgendaActivity({ params }){

    const result={
        code:200,
        message:'',
    };


    if( !params.id || !check.string(params.id) ){
        result.code = 400;
        result.message = 'Se requiere el id del usuario para continuar';
        return result;
    }

    return result;

}

function createDateActivity({ body }){
    const regexFecha = new RegExp(regex.fecha.pattern);
    const regexHora = new RegExp(regex.hora.pattern)

    const result={
        code: 200,
        message: '',
    }

    if(!body.idUsuario || !check.string(body.idUsuario) || !isUUID(body.idUsuario)){
        result.code = 400;
        result.message= 'Se requiere el id del usuario'
        return result
    }

    if(!body.idActividad || !check.string(body.idActividad)){
        result.code = 400;
        result.message= 'Se requiere el id de la actividad'
        return result
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

    if(!body.hora  || !check.string(body.hora)){
        result.code=400;
        result.message='Ingrese la hora en la que inicia la actividad';
        return result;
    }

    if(!regexHora.test(body.horaInicio)){
        result.code=400;
        result.message='El formato de la hora deber ser HH:MM y uso de las 24 hrs.';
        return result;
    }



    return result;
}

module.exports={
    getAgendaActivity,
    createDateActivity,
}