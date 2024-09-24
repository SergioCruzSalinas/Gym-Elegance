'use strict'

const pc = require('picocolors');
const { api } = require('../../config/config');



module.exports = (app) => {
    app.get(`${api.baseEndpoint}/actividades`, (req, res) => {
        console.log(pc.bgWhite(pc.black('GET request a /actividades')));
        res.status(200).send('Hola desde la ruta de actividades');
    });
};