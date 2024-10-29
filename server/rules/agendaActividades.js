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




    return result;
}

function updateDateActivity({ params, body }){
    const result={
        code:200,
        message: '',
    };

    if(!params.id || !check.string(params.id) || !isUUID(params.id) ){
        result.code=400;
        result.message='Se requiere el id de la cita para continuar';
        return result;
    }

    if(!body.idUsuario || !check.string(body.idUsuario) || !isUUID(body.idUsuario)){
        result.code = 400;
        result.message= 'Se requiere el id del usuario'
        return result
    }

    if(!body.idActividad){
        result.code = 400;
        result.message= 'Se requiere el id de la actividad'
        return result
    }

    return result;

}

function updateAsistenceDate({ params, body }){
    const result = {
        code:200,
        message:'',
    };

    if(!params.id || !check.string(params.id) || !isUUID(params.id)){
        result.code = 400;
        result.message = 'Se requiere el folio de la cita para continuar';
        return result;
    }

    if(!body.asistencia || !check.string(body.asistencia)){
        result.code = 400;
        result.message = 'Se requiere el estatus de la cita';
        return result
    }

    return result;
}

module.exports={
    getAgendaActivity,
    createDateActivity,
    updateDateActivity,
    updateAsistenceDate,
}