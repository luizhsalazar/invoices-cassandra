const express = require('express'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	nunjucks = require('nunjucks');	

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(require('./routes/invoices.route'));
app.use(require('./routes/migration.route'));

const port = process.env.PORT || 4000;

// Configure Nunjucks
var _templates = process.env.NODE_PATH ? process.env.NODE_PATH + '/templates' : 'templates';
nunjucks.configure(_templates, {
	autoescape: true,
	cache: false,
	express: app
});

// Set Nunjucks as rendering engine for pages with .html suffix
app.engine('html', nunjucks.render);
app.set('view engine', 'html');

const server = app.listen(port, function () {
	console.log('Listening on port ' + port);
});
