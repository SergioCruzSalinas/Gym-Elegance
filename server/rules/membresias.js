'use strict';
const check = require('check-types');


function createMembership({body}){
    const result={
        code:200,
        message:''
    };

    if(!body.tipo || !check.string(body.tipo)){
        result.code=400;
        result.message='Se requiero el nombre del plan'
        return result
    };

    if(body.mesDuracion === undefined || body.mesDuracion === null){
        result.code=400;
        result.message='Se requiere el de mes de duracion'
        return result;
    }

    if(!Number.isInteger(body.mesDuracion)){
        result.code=400;
        result.message='ingrese los meses de duracion como un numero'
        return result;
    }

    if(body.diasDuracion===undefined || body.diasDuracion===null){
        result.code=400
        result.message='se requiere el numero de dias de duracion'
        return result
    }

    if(!Number.isInteger(body.mesDuracion)){
        result.code=400;
        result.message='ingrese los dias de duracion como un numero'
        return result;
    }

    if(!body.descripcion || !check.string(body.descripcion)){
        result.code=400;
        result.message='Se requiere la descripcion del plan'
        return result
    }

    if(!body.precio){
        result.code=400;
        result.message='Se requiere el precio del plan'
        return result;
    }

    if(!Number.isInteger(body.precio)){
        result.code=400;
        result.message='ingrese el precio como un numero entero'
        return result;
    }

    return result;
};

function updateMembership({body, params}){
    const result={
        code:200,
        message:''
    };

    if(!params.id){
        result.code=400;
        result.message='Se requiere el id del plan para continuar'
        return result;
    }

    if(!body.tipo || !check.string(body.tipo)){
        result.code=400;
        result.message='Se requiere el nombre del plan'
        return result
    };

    if(body.mesDuracion === undefined || body.mesDuracion === null){
        result.code=400;
        result.message='Se requiere el de mes de duracion'
        return result;
    }

    if(!Number.isInteger(body.mesDuracion)){
        result.code=400;
        result.message='Ingrese los meses de duracion como un numero'
        return result;
    }

    if(body.diasDuracion===undefined || body.diasDuracion===null){
        result.code=400
        result.message='se requiere el numero de dias de duracion'
        return result
    }

    if(!Number.isInteger(body.mesDuracion)){
        result.code=400;
        result.message='Ingrese los dias de duracion como un numero'
        return result;
    }

    if(!body.descripcion || !check.string(body.descripcion)){
        result.code=400;
        result.message='Se requiere la descripcion del plan'
        return result
    }

    if(!body.precio){
        result.code=400;
        result.message='Se requiere el precio del plan'
        return result;
    }

    if(!Number.isInteger(body.precio)){
        result.code=400;
        result.message='Ingrese el precio como un numero entero'
        return result;
    }

    return result;
};

function changeStatusMemberships({params}){

    const result={
        code:200,
        message:''
    }

    if(!params.id){
        result.code=400;
        result.message='Se requiere el id para continuar'
        return result;
    }

    return result;
}

module.exports={
    createMembership,
    updateMembership,
    changeStatusMemberships,

}