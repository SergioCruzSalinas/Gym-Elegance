'use strict';

const { default: isEmail } = require("validator/lib/isEmail");
const check = require('check-types');
const { isUUID } = require("validator");

// funcion encargada de mostrar informacion de un usuario
function getUser({ params }){
    const result={
        code:200,
        message:""
    };

    if(!params.id || !check.string(params.id) || !isUUID(params.id)){
        result.code=400;
        result.message="Se requiere el id del usuario para continuar"
    }

    return result;
}

// funcion encargada de validar los dato para crear el usuario

function createUser({ body }){

    const result = {
        code: 200,
        message: '',
    };

    if(!body.nombreUsuario || !check.string(body.nombreUsuario)){
        result.code=400;
        result.message="se requiere el nombre del usuarios";
        return result;
    };

    if(!body.correoElectronico || !check.string(body.correoElectronico)){
        result.code=400;
        result.message="Se requiere un correo electronico"
        return result;
    }

    if(!isEmail(body.correoElectronico)){
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

function updateUser({ params, body }){
    const result={
        code:200,
        message:"",
    };

    if(!params.id || !check.string(params.id) || !isUUID(params.id)){
        result.code=400;
        result.message="El identificador es requerido para continuar "
        return result
    };
    
    if(!body.nombreUsuario || !check.string(body.nombreUsuario)){
        result.code=400;
        result.message="se requiere el nombre del usuario";
        return result;
    };
    
    if(!body.correoElectronico || !check.string(body.correoElectronico)){
        result.code=400;
        result.message="Se requiere un correo electronico"
        return result;
    };
    
    if(!isEmail(body.correoElectronico)){
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
function deleteUser({ params }){
    const result={
        code:200,
        message:"",
    };

    if(!params.id || !check.string(params.id) || !isUUID(params.isEmail)){
        result.code=400;
        result.message="Se requiere el id de usuario para continuar"
        return result;
    }

    return result;
};




module.exports={
    getUser,
    createUser,
    updateUser,
    deleteUser,

};