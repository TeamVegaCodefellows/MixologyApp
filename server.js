	var express  = require('express');
	var app      = express(); 								
	var http     = require('http');
	var mongoose = require('mongoose'); 			

	// configuration =================

	mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'); 

	app.configure(function() {
		app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
		app.use(express.logger('dev')); 						// log every request to the console
		app.use(express.bodyParser()); 							// pull information from html in POST
  	app.use(express.cookieParser());
		app.use(express.methodOverride()); 						// simulate DELETE and PUT
	});

	

	app.get('/', function(err, res){
		res.send('this');
	});

	

	var server = http.createServer(app);
	server.listen(3000, function() {
		console.log("App listening on port 3000");	
	})
	