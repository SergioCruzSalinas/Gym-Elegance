const check = require("check-types");
const { isUUID } = require("validator");
const { regex } = require("../config/config");

function createInscripcion({body}){
    const regexFecha=new RegExp(regex.fecha.pattern);

    const result={
        code:200,
        message:'',
    };

    if(!body.idUsuario || !check.string(body.idUsuario)){
        result.code=400;
        result.message='Se requiere el id del usuario';
        return result;
    }

    if(!isUUID(body.idUsuario)){
        result.code=400;
        result.message='El formato del id del usuario es incorrecto';
        return result;
    }

    if(!body.idMembresia){
        result.code=400;
        result.message='Se requiere el id de la membresia para continuar';
        return result;
    }

    if(!body.fechaInicio || !check.string(body.fechaInicio)){
        result.code=400;
        result.message='Se requiere la fecha de inicio para continuar';
        return result;
    }

    if(!regexFecha.test(body.fechaInicio)){
        result.code=400;
        result.message='El formato de la fecha debe ser YYYY-MM-DD';
        return result;
    }

    return result

}

function updateInscripcion({params, body}){
    const result={
        code:200,
        message:'',
    }

    if(!params.id || !check.string(params.id) || !isUUID(params.id)){
        result.code=400;
        result.message='Se requiere el id de la inscripcion para continuar'
        return result
    }

    if(!body.idUsuario || !check.string(body.idUsuario)){
        result.code=400;
        result.message='Se requiere el id del usuario';
        return result;
    }

    if(!isUUID(body.idUsuario)){
        result.code=400;
        result.message='El formato del id del usuario es incorrecto';
        return result;
    }

    if(!body.idMembesia){
        result.code=400;
        result.message='Se requiere el id de la membresia para continuar';
        return result;
    }

    if(!body.fechaInicio || check.string(body.fechaInicio)){
        result.code=400;
        result.message='Se requiere la fecha de inicio para continuar';
        return result;
    }

    if(!regexFecha.test(body.fechaInicio)){
        result.code=400;
        result.message='El formato de la fecha debe ser YYYY-MM-DD';
        return result;
    }

    return result

}

function changeStatusScripcion({params}){
    const result={
        code:200,
        message:''
    };

    if(!params.id || !check.string(params.id)){
        result.code=400;
        result.message='Se requiere el id de la inscripcion para continuar'
        return result;
    }

    if(!isUUID(params.id)){
        result.code=400;
        result.message='El formato del id es incorrecto';
        return result;
    }

    return result;

}

module.exports={
    createInscripcion,
    updateInscripcion,
    changeStatusScripcion,
    
}