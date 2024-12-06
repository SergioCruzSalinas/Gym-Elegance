'use strict';

const check = require('check-types')
const { isBase64, isEmail } = require('validator')


function createSession({ body }){
    const result = {
        code: 200,
        message: ''
    };

    if(!body.correoElectronico || !check.string(body.correoElectronico)){
        result.code = 400;
        result.message = 'Se requiere el correo electronico para continuar'
        return result;
    }

    if( !isEmail(body.correoElectronico)){
        result.code = 400;
        result.message = 'El formato del correo electronico no es valido';
        return result;
    }

    if(!body.contrasenia || !check.string(body.contrasenia)){
        result.code = 400;
        result.message = 'Se requiere la contrasenia para continuar';
        return result;
    }

    return result


}

module.exports = {
    createSession,
}