	var express  = require('express');
	var app      = express(); 								
	var http     = require('http');
	var mongoose = require('mongoose'); 			


	mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'); 

	app.configure(function() {
		app.use(express.static(__dirname + '/build')); 		
		app.use(express.logger('dev')); 						
		app.use(express.bodyParser()); 						
  	app.use(express.cookieParser());
		app.use(express.methodOverride()); 				
	});

	

	app.get('/', function(err, res){
		res.send('this');
	});

	

	var server = http.createServer(app);
	server.listen(3000, function() {
		console.log("App listening on port 3000");	
	})
	