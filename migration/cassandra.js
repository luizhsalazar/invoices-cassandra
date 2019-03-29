/*
CREATE KEYSPACE invoices WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

USE invoices

CREATE TABLE invoices
(
  invoiceNumber      double,
  customerName       text,
  customerAddress    text,
  serviceDescription text,
  serviceQuantity    double,
  serviceValue       double,
  resourceName       text,
  resourceFunction   text,
  serviceTax         double,
  serviceDiscount    double,
  serviceSubtotal    double,
  invoiceValue       double,
  PRIMARY KEY (invoiceNumber)
)
*/

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    keyspace: 'invoices'
});

const queryInsert = `INSERT INTO invoices (
invoiceNumber,
customerName,
customerAddress,
serviceDescription,
serviceQuantity,
serviceValue,
resourceName,
resourceFunction,
serviceTax,
serviceDiscount,
serviceSubtotal,
invoiceValue
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const cassandraModule = {
    insertInvoices: (invoices) => {

        let queries = [];
        let promises = [];

        invoices.forEach(i => {

            queries.push({
                query: queryInsert,
                params: [
                    i.invoiceNumber,
                    i.customerName,
                    i.customerAddress,
                    i.serviceDescription,
                    i.serviceQuantity,
                    i.serviceValue,
                    i.resourceName,
                    i.resourceFunction,
                    i.serviceTax,
                    i.serviceDiscount,
                    i.serviceSubtotal,
                    i.invoiceValue
                ]
            });

            if (queries.length === 100) {
                promises.push(client.batch(queries));
                queries = [];
            }

        });

        promises.push(client.batch(queries, {prepare: true}));

        return Promise.all(promises);

    },
    getInvoice: async (invoiceNumber) => {

        const query = 'SELECT * FROM invoices WHERE invoiceNumber = ?';
        const invoice = await client.execute(query, [parseInt(invoiceNumber)]);

        const invoiceRow = invoice.rows[0];
        const invoiceObj = {
            invoiceNumber: invoiceRow.invoicenumber,
            customerName: invoiceRow.customername,
            customerAddress: invoiceRow.customeraddress,
            invoiceValue: invoiceRow.invoicevalue,
            items: []
        };

        if (invoice && invoice.rows.length) {
            invoice.rows.forEach(item => {
                invoiceObj.items.push({
                    serviceDescription: item.servicedescription,
                    serviceQuantity: item.servicequantity,
                    serviceValue: item.servicevalue,
                    resourceName: item.resourcename,
                    resourceFunction: item.resourcefunction,
                    serviceTax: item.servicetax,
                    serviceDiscount: item.servicediscount,
                    serviceSubtotal: item.servicesubtotal
                })
            });
        }

        return invoiceObj;

    }
};

module.exports = cassandraModule;



