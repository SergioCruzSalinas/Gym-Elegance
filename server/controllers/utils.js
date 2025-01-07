const db = require('../db/index');

async function registerMembership(client, tipo, diasDuracion, mesDuracion, descripcion, precio) {
    const result = {
        code: 200,
        message: '',
    };

    // Realizar el conteo de membresías
    const count = await db.count({ client, query: 'SELECT count(*) FROM ca_membresias' });

    // Verificar si la consulta de conteo fue exitosa
    if (count.code !== 200) {
        await client.query('ROLLBACK');
        result.code = 500;
        result.message = 'Ocurrió un error al contar las membresías';
        return result;
    }
    console.log("count*******************",count)

    // Obtener el número total de membresías y calcular el próximo ID
    const totalMembresias = count.data ? count.data : 0;
    const idMembresia = totalMembresias + 1;

    // Insertar la nueva membresía
    const createMembership = await db.insert({
        client,
        insert: 'INSERT INTO ca_membresias(id, tipo, dias_duracion, mes_duracion, descripcion, precio) VALUES($1, $2, $3, $4, $5, $6)',
        values: [idMembresia, tipo, diasDuracion, mesDuracion, descripcion, precio]
    });

    // Verificar si la inserción fue exitosa
    if (createMembership.code !== 200) {
        await client.query('ROLLBACK');
        result.code = 500;
        result.message = 'Ocurrió un error al ingresar los datos de la membresía';
        return result;
    }

    return result;
}

async function registerActivity(client, descripcion, estatus, cupo, idCoach, fecha, horaInicio, HoraFin){
    const result = {
        code: 200,
        message: '',
    };

    const count = await db.count({ client, query:'SELECT count(*) FROM ca_actividades'})

    if(count.code !== 200){
        await client.query('ROLLBACK')
        result.code = 500;
        result.message = 'Ocurrio un error al contar las actividades';
        return result;
    }

    const totalActividades = count.data ? count.data : 0;
    const idActividad = totalActividades + 1;

    const createActivity = await db.insert({
        client,
        insert:'INSERT INTO ca_actividades(id, descripcion, estatus, cupo, id_instructor, fecha, hora_inicio, hora_fin) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        values:[idActividad, descripcion, estatus, cupo, idCoach, fecha, horaInicio, HoraFin],
    });

    if(createActivity.code !== 200){
        await client.query('ROLLBACK');
        result.code = 500;
        result.message = 'Ocurrio un error al ingresar los datos de la actividad';
        return result;
    }

    return result;
}


function formatDate(dateTime) {
  const date = new Date(dateTime); 
  const year = date.getFullYear(); 
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const day = date.getDate().toString().padStart(2, '0'); 

  return `${year}-${month}-${day}`; 
}



function formatHour(dateString) {
    
    if (typeof dateString !== 'string' || !/^(\d{2}):(\d{2}):(\d{2})$/.test(dateString)) {
        throw new Error('Formato de hora inválido');
    }

    
    return dateString.slice(0, 5); 
}






module.exports = {
    registerMembership,
    registerActivity,

    formatDate,
    formatHour,
};
