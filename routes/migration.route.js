const express = require('express');
const routes = express.Router();
const mysql = require('../migration/mysql');
const cassandra = require('../migration/cassandra');

routes.route('/migration').get(async (req, res) => {
    try {
        const mysqlInvoices = await mysql.getInvoices();
        const result = await cassandra.insertInvoices(mysqlInvoices);
        res.json(result);
    } catch (e) {
        res.json(e);
    }
});

module.exports = routes;
