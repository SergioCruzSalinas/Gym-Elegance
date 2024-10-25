const db = require('../db/index');

async function registerMembership(client, tipo, diasDuracion, mesDuracion, descripcion, precio) {
    const result = {
        code: 200,
        message: ''
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

module.exports = {
    registerMembership
};
