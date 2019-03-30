const express = require('express');
const routes = express.Router();

const fs = require('fs'),
      pdf = require('html-pdf'),
      cassandra = require('cassandra-driver');

let templateHtml = fs.readFileSync('./test.html', 'utf8');
const options = { format: 'A4' };

// const client = new cassandra.Client({
//     contactPoints: ['localhost:9042'],
//     localDataCenter: 'datacenter1',
//     keyspace: 'chat'
// });

routes.route('/invoices/:invoice_number').get(function (req, response) {
    let invoice_number = req.params.invoice_number;
    
    invoices = [
        {
            servicedescription: "Maintenance of workflow system",
            servicequantity: 32,
            servicevalue: "$40.00",
            resourcename: "Andrew S. Tanenbaum",
            resourcefunction: "Plain",
            servicetax: 0.25,
            servicediscount: 0.07,
            servicesubtotal: "$1510.39"
        },
        {
            servicedescription: "asda Maintenance of workflow system",
            servicequantity: 32,
            servicevalue: "$40.00",
            resourcename: "Andrew S. Tanenbaum",
            resourcefunction: "Plain",
            servicetax: 0.25,
            servicediscount: 0.07,
            servicesubtotal: "$1510.39"
        }
    ];

    response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment; filename=test.pdf`,
    });
    
    response.render('test.html', {"invoices": invoices}, function(err, templateHTML) {
        pdf.create(templateHTML, options).toStream((err, stream) => {
            stream.pipe(response);
        });
    });
    
    // const query = 'SELECT * FROM users';
    
    // client
    // .execute(query)
    // .then(result => {
    //     console.log('User with email %s', result.rows[0].email);
    //     templateHtml = templateHtml.replace('{{ invoicenumber }}', 1946369);
    //     templateHtml = templateHtml.replace('{{ customername }}', "Pirelli");
    //     templateHtml = templateHtml.replace('{{ customeraddress }}', "Viale Piero e Alberto Pirelli n. 25 (reception in Via Bicocca degli Arcimboldi, 3) 20126 Milan");
    
    //     invoices = [
    //         {
    //             servicedescription: "Maintenance of workflow system",
    //             servicequantity: 32,
    //             servicevalue: "$40.00",
    //             resourcename: "Andrew S. Tanenbaum",
    //             resourcefunction: "Plain",
    //             servicetax: 0.25,
    //             servicediscount: 0.07,
    //             servicesubtotal: "$1510.39"
    //         },
    //         {
    //             servicedescription: "asda Maintenance of workflow system",
    //             servicequantity: 32,
    //             servicevalue: "$40.00",
    //             resourcename: "Andrew S. Tanenbaum",
    //             resourcefunction: "Plain",
    //             servicetax: 0.25,
    //             servicediscount: 0.07,
    //             servicesubtotal: "$1510.39"
    //         }
    //     ];
    
    //     // templateHtml = templateHtml.replace('{{ invoice }}', invoice);
    
    //     // templateHtml = templateHtml.replace('{{ servicedescription }}', "Maintenance of workflow system");
    //     // templateHtml = templateHtml.replace('{{ servicequantity }}', 32);
    //     // templateHtml = templateHtml.replace('{{ servicevalue }}', "$40.00");
    //     // templateHtml = templateHtml.replace('{{ resourcename }}', "Andrew S. Tanenbaum");
    //     // templateHtml = templateHtml.replace('{{ resourcefunction }}', "Plain");
    //     // templateHtml = templateHtml.replace('{{ servicetax }}', "0.25");
    //     // templateHtml = templateHtml.replace('{{ servicediscount }}', "0.07");
    //     // templateHtml = templateHtml.replace('{{ servicesubtotal }}', "$1510.39");
    
    //     templateHtml = templateHtml.replace('{{ invoicevalue }}', "$6465.39");
    
    //     res.writeHead(200, {
    //         'Content-Type': 'application/pdf',
    //         'Content-disposition': `attachment; filename=test.pdf`,
    //     });
    
    //     pdf.create(templateHtml, options).toStream((err, stream) => {
    //         stream.pipe(res);
    //     });
    // });
});

module.exports = routes;