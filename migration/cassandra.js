/*
CREATE KEYSPACE invoices WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

USE invoices

CREATE TABLE invoices
(
  id                 double,
  invoiceNumber      double,
  serviceNumber      double,
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
  PRIMARY KEY (serviceNumber)
)
*/

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
    contactPoints: ['localhost:9042'],
    localDataCenter: 'datacenter1',
    keyspace: 'invoices'
});

const queryInsert = `INSERT INTO invoices (
id,
invoiceNumber,
serviceNumber,
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
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const cassandraModule = {
    insertInvoice: (id, invoice) => {

        return client.execute(queryInsert, [
            id,
            invoice.invoiceNumber,
            invoice.serviceNumber,
            invoice.customerName,
            invoice.customerAddress,
            invoice.serviceDescription,
            invoice.serviceQuantity,
            invoice.serviceValue,
            invoice.resourceName,
            invoice.resourceFunction,
            invoice.serviceTax,
            invoice.serviceDiscount,
            invoice.serviceSubtotal,
            invoice.invoiceValue
        ]);

    },
    insertInvoices: (invoices) => {

        let queries = [];
        let promises = [];

        invoices.forEach(i => {

            queries.push({
                query: queryInsert,
                params: [
                    i.invoiceNumber,
                    i.serviceNumber,
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

        const query = 'SELECT * FROM invoices WHERE invoiceNumber = ? ALLOW FILTERING';
        const invoice = await client.execute(query, [parseInt(invoiceNumber)]);

        const invoiceRow = invoice.rows[0];
        const invoiceObj = {
            invoiceNumber: invoiceRow.invoicenumber,
            customerName: invoiceRow.customername,
            customerAddress: invoiceRow.customeraddress,
            invoiceValue: invoiceRow.invoicevalue.toFixed(2),
            items: []
        };

        if (invoice && invoice.rows.length) {
            invoice.rows.forEach(item => {
                const totalValue = item.servicevalue * item.servicequantity;
                invoiceObj.items.push({
                    serviceNumber: item.servicenumber,
                    serviceDescription: item.servicedescription,
                    serviceQuantity: item.servicequantity,
                    serviceValue: item.servicevalue.toFixed(2),
                    resourceName: item.resourcename,
                    resourceFunction: item.resourcefunction,
                    serviceTax: (item.servicetax * totalValue).toFixed(2),
                    serviceDiscount: (item.servicediscount * totalValue).toFixed(2),
                    serviceSubtotal: item.servicesubtotal.toFixed(2)
                })
            });
        }

        return invoiceObj;

    }
};

module.exports = cassandraModule;



