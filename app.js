var express = require('express');
var favicon = require('serve-favicon');
var mustacheExpress = require('mustache-express');
var http = require('http');
var path = require('path');
var app = express();
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
	.use(favicon(__dirname + '/favicon.ico'))
	.use('/', express.static(__dirname));

// routing
app
	.get('/', function(req, res) {
		res.render('index', getModel('home'));
	})
	.get('/home', function(req, res) {
		res.render('index', getModel('home'));
	})
	.get('/:template', function(req, res) {
		// test for root level 404
		if (!getModel(req.params.template)) {
			res.render('404', getModel('404'));
		} else {
			res.render(req.params.template, getModel(req.params.template));    
		}
	})
	.get('*', function(req, res){
		// test for all other 404
		res.render('404', getModel('404'));
	});

module.exports = app;