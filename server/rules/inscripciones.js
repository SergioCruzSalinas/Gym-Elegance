const check = require("check-types");
const { isUUID } = require("validator");
const { regex } = require("../config/config");

function getInscripcion({params}){

    const result={
        code:200,
        message:''
    };

    if(!params.id || !check.string(params.id)){
        result.code=400;
        result.message='Se requiere el id para ver la inscripcion'
        return result;
    }

    return result;
}


function createInscripcion({body}){
    const regexFecha=new RegExp(regex.fecha.pattern);

    const result={
        code:200,
        message:'',
    };

    if(!body.id_usuario || !check.string(body.id_usuario)){
        result.code=400;
        result.message='Se requiere el id del usuario';
        return result;
    }

    if(!isUUID(body.id_usuario)){
        result.code=400;
        result.message='El formato del id del usuario es incorrecto';
        return result;
    }

    if(!body.id_membresia){
        result.code=400;
        result.message='Se requiere el id de la membresia para continuar';
        return result;
    }

    if(!body.fecha_inicio || !check.string(body.fecha_inicio)){
        result.code=400;
        result.message='Se requiere la fecha de inicio para continuar';
        return result;
    }

    if(!regexFecha.test(body.fecha_inicio)){
        result.code=400;
        result.message='El formato de la fecha debe ser YYYY-MM-DD';
        return result;
    }

    return result

}

function updateInscripcion({params, body}){

    const regexClave = new RegExp(regex.clave.pattern)
    const regexFecha= new RegExp(regex.fecha.pattern)

    const result={
        code:200,
        message:'',
    }

    if(!params.id || !check.string(params.id)){
        result.code=400;
        result.message='Se requiere el id de la inscripcion para continuar';
        return result;
    }

    if( !regexClave.test(params.id)){
        result.code=400;
        result.message='Se requiere el formato del id';
        return result;
    }

    if(!body.id_usuario || !check.string(body.id_usuario)){
        result.code=400;
        result.message='Se requiere el id del usuario';
        return result;
    }

    if(!isUUID(body.id_usuario)){
        result.code=400;
        result.message='El formato del id del usuario es incorrecto';
        return result;
    }

    if(!body.id_membresia){
        result.code=400;
        result.message='Se requiere el id de la membresia para continuar';
        return result;
    }

    if( !Number.isInteger(body.id_membresia)){
        result.code=400;
        result.message='El id de la membresia se requiere como un numero entero';
        return result;
    }

    if(!body.fecha_inicio || !check.string(body.fecha_inicio)){
        result.code=400;
        result.message='Se requiere la fecha de inicio para continuar';
        return result;
    }

    if(!regexFecha.test(body.fecha_inicio)){
        result.code=400;
        result.message='El formato de la fecha debe ser YYYY-MM-DD';
        return result;
    }

    return result

}

function changeStatusInscripcion({params}){
    const regexClave= new RegExp(regex.clave.pattern)
    const result={
        code:200,
        message:''
    };

    if(!params.id || !check.string(params.id)){
        result.code=400;
        result.message='Se requiere el id de la inscripcion para continuar'
        return result;
    }

    if( !regexClave.test(params.id)){
        result.code=400;
        result.message='El formato del id es incorrecto';
        return result;
    }

    return result;

}

module.exports={
    getInscripcion,
    createInscripcion,
    updateInscripcion,
    changeStatusInscripcion,
    
}