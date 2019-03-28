const express = require('express');
const routes = express.Router();

var path = require('path');
var fs = require('fs');
var pdf = require('html-pdf');
var templateHtml = fs.readFileSync('./test.html', 'utf8');
var options = { format: 'A4' };

var image = path.join('file://', __dirname, 'segsoft.jpg');
templateHtml = templateHtml.replace('{{ image }}', image);

routes.route('/invoices/:invoice_number').get(function (req, res) {
    let invoice_number = req.params.invoice_number;
    console.log('invoice number:' + invoice_number);
    
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment; filename=test.pdf`,
    });
    
    pdf.create(templateHtml, options).toStream((err, stream) => {
        stream.pipe(res);
    });
});

module.exports = routes;