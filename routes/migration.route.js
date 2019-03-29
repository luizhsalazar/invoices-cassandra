const express = require('express');
const routes = express.Router();
const mysql = require('../migration/mysql');
const cassandra = require('../migration/cassandra');

routes.route('/migration').get(async (req, res) => {
    try {
        const mysqlInvoices = await mysql.getInvoices();
        let count = 0;
        for(const invoice of mysqlInvoices) {
            const result = await cassandra.insertInvoice(count, invoice);
            count++;
        }
        res.json({ count });
    } catch (e) {
        res.json(e);
    }
});

module.exports = routes;
