'use strict'

const pc = require('picocolors');
const { api } = require('../config/config')

const controllersDB = require('../controllers/getDataBase')

module.exports = (app) =>{
    app.post(`${api.baseEndpoint}/seed`, controllersDB.insertDataBase);
}