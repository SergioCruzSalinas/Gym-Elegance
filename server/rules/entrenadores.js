'use strict';

const { default: isEmail } = require("validator/lib/isEmail");
const check = require('check-types');
const { isUUID } = require("validator");

// funcion encargada de mostrar informacion de un usuario
function getCoach({ params }){
    const result={
        code:200,
        message:""
    };

    if(!params.id || !check.string(params.id) || !isUUID(params.id)){
        result.code=400;
        result.message="Se requiere el id del usuario para continuar";
        return result;
    }

    return result;
}

// funcion encargada de validar los dato para crear el usuario

function createCoach({ body }){

    const result = {
        code: 200,
        message: '',
    };

    if(!body.nombre || !check.string(body.nombre)){
        result.code=400;
        result.message="se requiere el nombre del usuarios";
        return result;
    };

    if(!body.correo_electronico || !check.string(body.correo_electronico)){
        result.code=400;
        result.message="Se requiere un correo electronico"
        return result;
    }

    if(!isEmail(body.correo_electronico)){
        result.code=400;
        result.message="El formato del correo electronico no es correcto"
    }

    if(!body.telefono || !check.string(body.telefono) || body.telefono.trim().length !== 10){
        result.code=400;
        result.message="Se requiere un numero telefonico"
    }

    //crear un regex para una contraseña
    if(!body.contrasenia){
        result.code=400;
        result.message="Se requiere una contrasenia"
    }

    if(body.contrasenia.length <= 6){
        result.code=400;
        result.message="Se requiere un contraseña mayor a 6 caracteres"
    }

    return result;

};

//funcion encargada de validar los datos para editar la informacion del usuario

function updateCoach({ params, body }){
    const result={
        code:200,
        message:"",
    };

    if(!params.id || !check.string(params.id) || !isUUID(params.id)){
        result.code=400;
        result.message="El identificador es requerido para continuar "
        return result
    };
    
    if(!body.nombre || !check.string(body.nombre)){
        result.code=400;
        result.message="se requiere el nombre del usuario";
        return result;
    };
    
    if(!body.correo_electronico || !check.string(body.correo_electronico)){
        result.code=400;
        result.message="Se requiere un correo electronico"
        return result;
    };
    
    if(!isEmail(body.correo_electronico)){
        result.code=400;
        result.message="El formato del correo electronico no es correcto"
    };
    
    if(!body.telefono || !check.string(body.telefono) || body.telefono.trim().length !== 10){
        result.code=400;
        result.message="Se requiere un numero telefonico"
    };

    return result;
};

//funcion ecargada de validar los datos para eliminar el usuario
function changeStatusCoach({ params }){
    const result={
        code:200,
        message:"",
    };

    if(!params.id || !check.string(params.id) || !isUUID(params.id)){
        result.code=400;
        result.message="Se requiere el id de usuario para continuar"
        return result;
    }

    return result;
};




module.exports={
    getCoach,
    createCoach,
    updateCoach,
    changeStatusCoach,

};