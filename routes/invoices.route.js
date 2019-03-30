const express = require('express');
const routes = express.Router();

const pdf = require('html-pdf'),
      cassandra = require('../migration/cassandra');

const options = { format: 'A4', orientation: 'landscape' };

routes.route('/invoices/:invoice_number').get(async (req, response) => {
    let invoice_number = req.params.invoice_number;
    
    try {
        const invoice_result = await cassandra.getInvoice(invoice_number);
        
        response.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-disposition': `attachment; filename=invoice-${invoice_number}.pdf`,
        });
        
        response.render('invoice.html', {"invoice": invoice_result}, function(err, templateHTML) {
            pdf.create(templateHTML, options).toStream((err, stream) => {
                stream.pipe(response);
            });            
        });
    } catch (e) {
        response.json(e);
    }
});

module.exports = routes;
