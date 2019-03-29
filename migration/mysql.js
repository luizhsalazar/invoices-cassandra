/*
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''
*/

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'invoices'
});

connection.connect();

const query = `SELECT service.service_description AS serviceDescription, 
       invoice_item.quantity AS serviceQuantity, 
       invoice_item.unit_value AS serviceValue, 
       resource.NAME as resourceName, 
       resource_qualification.qualificatin_name AS resourceFunction, 
       invoice_item.invoice_item_id AS serviceNumber, 
       invoice_item.tax_percent AS serviceTax, 
       invoice_item.discount_percent AS serviceDiscount, 
       invoice_item.subtotal AS serviceSubtotal, 
       invoice.value AS invoiceValue,
       invoice.number AS invoiceNumber,
       customer.name AS customerName,
       customer.address AS customerAddress
       FROM   invoice_item 
       LEFT JOIN resource 
              ON resource.id_resource = invoice_item.resource_id 
       LEFT JOIN resource_qualification_assignement 
              ON resource_qualification_assignement.resource_id = 
                 invoice_item.resource_id 
       LEFT JOIN resource_qualification 
              ON resource_qualification.id_resource_qualification = 
                 resource_qualification_assignement.qualification_id 
       LEFT JOIN service 
              ON service.service_id = invoice_item.service_id 
       LEFT JOIN invoice 
              ON invoice.number = invoice_item.invoice_id 
       LEFT JOIN customer 
              ON invoice.customer_id = customer.id_customer 
WHERE  invoice.value IS NOT NULL`;

const mysqlModule = {
    getInvoices: () => {
        return new Promise((result, reject) => {
            connection.query(query, function (error, results, fields) {
                if (error) {
                    throw error;
                    reject();
                }
                result(results);
                // connection.end();
            });
        })
    }
};

module.exports = mysqlModule;



