var express = require('express');
var favicon = require('serve-favicon');
var mustacheExpress = require('mustache-express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var app = express();
var port = 3636;
var server;

// model setup
var model = {
	'pkg': require('./package.json'),
	
	'home': require('./model/home'),
	'about': require('./model/about'),
	'404': require('./model/404')
}

function getModel(modelName) {    
	var formattedModel;

	if (!model[modelName]) {
		return false;
	}
	
	formattedModel = model[modelName];
	formattedModel.pkg = model.pkg;

	return formattedModel;
};

function partials(pattern) {
	var glob = require('glob');
	var path = require('path');
	var partials = {};
	pattern = pattern || __dirname + '/template/*.mustache';

	glob.sync(pattern).forEach(
		function (p) {
			var name = path.basename(p, path.extname(p));
			partials[name] = p;
		}
	);

	return partials;
};

// view engine config
app
	.set('views', __dirname + '/template')
	.set('view engine', 'mustache')
	.set('partials', partials())
	.engine('mustache', mustacheExpress());

// static file config
app
	// .use(favicon(__dirname + '/favicon.ico'))
	.use('/', express.static(__dirname));

// post data parsing
app
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false }));


// routing
app
	.post('/contact', (req, res) => {
		var sender = req.body.email,
			subject = req.body.subject,
			message = req.body.message,
			transporter = nodemailer.createTransport('smtp', {
				service: 'yahoo',
				auth: {
					user: 'craption@yahoo.com',
					pass: 'Freckles1!'
				}
			}),
			mailOptions = {
				transport: transporter,
				from: sender,
				to: 'craption@yahoo.com',
				subject: subject,
				text: message
			};

		nodemailer.sendMail(mailOptions, (error) => {
			if (error) {
				console.log(error);
				res.send(false);
				return;
			}

			res.send(true);
		});

	})
	.get('/', (req, res) => {
		res.render('index', getModel('home'));
	})
	.get('/home', (req, res) => {
		res.render('index', getModel('home'));
	})
	.get('/:template', (req, res) => {
		// test for root level 404
		if (!getModel(req.params.template)) {
			res.render('404', getModel('404'));
		} else {
			res.render(req.params.template, getModel(req.params.template));    
		}
	})
	.get('*', (req, res) => {
		// test for all other 404
		res.render('404', getModel('404'));
	});

app.set('port', port);

server = http.createServer(app);
server.listen(port);

module.exports = app;