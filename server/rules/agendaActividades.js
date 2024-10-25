const check = require("check-types");



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

module.exports={
    getAgendaActivity
}