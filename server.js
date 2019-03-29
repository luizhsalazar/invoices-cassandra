const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    nunjucks = require('nunjucks');

const routes = require('./routes/invoices.route');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);
const port = process.env.PORT || 4000;

// Configure Nunjucks
nunjucks.configure();

// Set Nunjucks as rendering engine for pages with .html suffix
// app.engine( 'html', nunjucks.render ) ;
// app.set('view engine', 'html');

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});