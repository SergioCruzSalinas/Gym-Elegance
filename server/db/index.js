'use strict';

const pc = require('picocolors');

/**
 * * Funcion encargada de realizar un count
 * @param {object} client Es el objeto de conexion a la base de datos
 * @param {string} query Es el codigo sql para realizar el count
 * @returns Regresa un objeto con un codigo de operacion, un mensaje y el resultado de la consulta
 */
async function count(params) {
  const json = {
    code: 200,
    message: '',
    data: null,
  };

  try {
    const { client, query } = params;

    if (!client || !query) {
      json.code = 400;
      json.message = 'Hacen falta datos para realizar la consulta';
      return json;
    }

    // Execute SQL queries here
    const count = await promiseCount({ client, query })
      .then((result) => result)
      .catch((err) => err);

    json.code = count !== null ? 200 : 500;
    json.message = count !== null ? '' : 'Ocurrió un problema al obtener los datos';
    json.data = parseInt(count);

    return json;
  } catch (error) {
    console.log(error);
    console.log(pc.yellow('Error: '), pc.red(error.message));
    json.code = 500;
    json.message = 'Ocurrió un problema al realizar la consulta';
    return json;
  }
}

/**
 * * Funcion encargada de realizar un select all
 * @param {object} client Es el objeto de conexion a la base de datos
 * @param {string} query Es el codigo sql para realizar la consulta
 * @returns Regresa un objeto con un codigo de operacion, un mensaje y el resultado de la consulta
 */
async function findAll(params) {
  const json = {
    code: 200,
    message: '',
    data: null,
  };

  try {
    const { client, query } = params;

    if (!client || !query) {
      json.code = 400;
      json.message = 'Hacen falta datos para realizar la consulta';
      return json;
    }

    // Execute SQL queries here
    const rows = await promiseFindAll({ client, query })
      .then((result) => result)
      .catch((err) => err);

    json.code = rows !== null ? 200 : 500;
    json.message = rows !== null ? '' : 'Ocurrió un problema al obtener los datos';
    json.data = rows;

    return json;
  } catch (error) {
    console.log(error);
    console.log(pc.yellow('Error: '), pc.red(error.message));
    json.code = 500;
    json.message = 'Ocurrió un problema al obtener los datos';
    return json;
  }
}

/**
 * * Funcion encargada de realizar un select
 * @param {object} client Es el objeto de conexion a la base de datos
 * @param {string} query Es el codigo sql para realizar la consulta
 * @returns Regresa un objeto con un codigo de operacion, un mensaje y el resultado de la consulta
 */
async function findOne(params) {
  const json = {
    code: 200,
    message: '',
    data: null,
  };

  try {
    let { client, query } = params;

    if (!client || !query) {
      json.code = 400;
      json.message = 'La consulta no es válida';
      return json;
    }

    let index = query.indexOf('WHERE');
    if (index < 0) {
      index = query.indexOf('where');
    }

    if (!query.includes('LIMIT', index >= 0 ? index : 0) && !query.includes('limit', index >= 0 ? index : 0)) {
      const index_semicolon = query.indexOf(';');
      query = query.replace(';', ' ');
      query += index_semicolon >= 0 ? 'LIMIT 1;' : ' LIMIT 1;';
    }

    // Execute SQL queries here
    const row = await promiseFindOne({ client, query })
      .then((result) => result)
      .catch((err) => err);

    json.code = row !== null ? 200 : 500;
    json.message = row !== null ? '' : 'Ocurrió un problema al obtener los datos';
    json.data = row;

    return json;
  } catch (error) {
    console.log(error);
    console.log(pc.yellow('Error: '), pc.red(error.message));
    json.code = 500;
    json.message = 'Ocurrió un problema al obtener los datos';
    return json;
  }
}

/**
 * * Funcion encargada de realizar un insert
 * @param {object} client Es el objeto de conexion a la base de datos
 * @param {string} insert Es el codigo sql para realizar el insert
 * @param {array} values Son los datos que se van a almacenar
 * @returns Regresa un objeto con un codigo de operacion, un mensaje y el resultado del insert
 */
async function insert(params) {
  const json = {
    code: 200,
    message: '',
    data: null,
  };

  try {
    let { client, insert, values } = params;

    if (!client || !insert || !values) {
      json.code = 400;
      json.message = 'Hacen falta datos para crear el registro';
      return json;
    }
    
    let index = insert.indexOf('WHERE');
    if (index < 0) {
      index = insert.indexOf('where');
    }

    if (
      !insert.includes('RETURNING', index >= 0 ? index : 0) &&
      !insert.includes('returning', index >= 0 ? index : 0)
    ) {
      const index_semicolon = insert.indexOf(';');
      insert = insert.replace(';', ' ');
      insert += index_semicolon >= 0 ? 'RETURNING *;' : ' RETURNING *;';
    }

    // Execute SQL queries here
    const rowCreated = await promiseInsert({ client, insert, values })
      .then((result) => result)
      .catch((err) => err);

    json.code = rowCreated !== null ? 200 : 500;
    json.message = rowCreated !== null ? '' : 'Ocurrió un problema al crear el registro';
    json.data = rowCreated;

    return json;
  } catch (error) {
    console.log(error);
    json.code = 500;
    json.message = 'Ocurrió un problema al construir la consulta';
    return json;
  }
}

/**
 * * Funcion encargada de realizar un update
 * @param {object} client Es el objeto de conexion a la base de datos
 * @param {string} update Es el codigo sql para realizar el update
 * @param {array} values Son los datos que se van a almacenar
 * @returns Regresa un objeto con un codigo de operacion, un mensaje y el resultado del update
 */
async function update(params) {
  const json = {
    code: 200,
    message: '',
    data: null,
  };

  try {
    const { client, update, values } = params;

    if (!client || !update || !values) {
      json.code = 400;
      json.message = 'Hacen falta datos para modificar el registro';
      return json;
    }

    // Execute SQL queries here
    const rowsUpdated = await promiseUpdate({ client, update, values })
      .then((result) => result)
      .catch((err) => err);

    json.code = rowsUpdated !== null ? 200 : 500;
    json.message = rowsUpdated !== null ? `` : `No fue posible modificar los datos`;
    json.data = rowsUpdated;

    return json;
  } catch (error) {
    console.log(error);
    console.log(pc.yellow('Error: '), pc.red(error.message));
    json.code = 500;
    json.message = 'Ocurrió un problema al modificar los registros';
    return json;
  }
}

/**
 * * Funcion encargada de realizar un delete
 * @param {object} client Es el objeto de conexion a la base de datos
 * @param {string} destroy Es el codigo sql para realizar el delete
 * @param {array} values Son los datos del registro por eliminar
 * @returns Regresa un objeto con un codigo de operacion, un mensaje y el resultado del delete
 */
async function destroy(params) {
  const json = {
    code: 200,
    message: '',
    data: null,
  };

  try {
    const { client, destroy, values } = params;

    if (!client || !destroy || !values) {
      json.code = 400;
      json.message = 'Hacen falta datos para eliminar el registro';
      return json;
    }

    // Execute SQL queries here
    const rowsDestroyed = await promiseDestroy({ client, destroy, values })
      .then((result) => result)
      .catch((err) => err);

    json.code = rowsDestroyed !== null ? 200 : 500;
    json.message = rowsDestroyed !== null ? `` : `No fue posible eliminar los registros`;
    json.data = rowsDestroyed;

    return json;
  } catch (error) {
    console.log(error);
    console.log(pc.yellow('Error: '), pc.red(error.message));
    json.code = 500;
    json.message = 'Ocurrió un problema al eliminar los registros';
    return json;
  }
}

module.exports = {
  count,
  findAll,
  findOne,
  insert,
  update,
  destroy,
};

const promiseCount = ({ client, query }) => {
  console.log(pc.magenta(query));

  return new Promise((resolve, reject) => {
    client.query(query, (err, result) => {
      if (err) {
        console.log(err);
        console.log(pc.red(`Error executing query`));
        reject(null);
      } else {
        resolve(result.rows[0].count);
      }

      return;
    });
  });
};

const promiseFindOne = ({ client, query }) => {
  console.log(pc.magenta(query));

  return new Promise((resolve, reject) => {
    client.query(query, (err, result) => {
      if (err) {
        console.log(err);
        console.log(pc.red(`Error executing query`));
        reject(null);
      } else {
        resolve(result.rows[0]);
      }

      return;
    });
  });
};

const promiseFindAll = ({ client, query }) => {
  console.log(pc.magenta(query));

  return new Promise((resolve, reject) => {
    client.query(query, (err, result) => {
      if (err) {
        console.log(err);
        console.log(pc.red(`Error executing query`));
        reject(null);
      } else {
        resolve(result.rows);
      }

      return;
    });
  });
};

const promiseInsert = ({ client, insert, values }) => {
  console.log('\n', pc.magenta(insert));
  console.log(pc.magenta('values:'), values);

  return new Promise((resolve, reject) => {
    client.query(insert, values, (err, result) => {
      if (err) {
        console.log(err);
        console.log(pc.red(`Error inserting data`));
        reject(null);
      } else {
        console.log(pc.green(`Data inserted successfully`));
        resolve(result.rows[0]);
      }

      return;
    });
  });
};

const promiseUpdate = ({ client, update, values }) => {
  console.log('\n', pc.magenta(update));
  console.log(pc.magenta('values:'), values);

  return new Promise(async (resolve, reject) => {
    client.query(update, values, async (err, result) => {
      if (err) {
        console.log(err);
        console.log(pc.red(`Error updating data`));
        reject(null);
      } else {
        console.log(pc.green(`Data updated successfully`));
        resolve(result.rowCount);
      }

      return;
    });
  });
};

const promiseDestroy = ({ client, destroy, values }) => {
  return new Promise((resolve, reject) => {
    console.log('\n', pc.magenta(destroy));
    console.log(pc.magenta('values:'), values);

    client.query(destroy, values, (err, result) => {
      if (err) {
        console.log(err);
        console.log(pc.red(`Error destroying data`));
        reject(null);
      } else {
        console.log(pc.green(`Data destroyed successfully`));
        resolve(result.rowCount);
      }

      return;
    });
  });
};
