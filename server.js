<<<<<<< HEAD
	var express  = require('express');
	var app      = express(); 								
	var http     = require('http');
	var mongoose = require('mongoose'); 			

	app.configure(function() {
		app.use(express.static(__dirname + '/build')); 		
		app.use(express.logger('dev')); 						
		app.use(express.bodyParser()); 						
  	app.use(express.cookieParser());
  	var session_secret = process.env.OAA_SESSION_SECRET || 'CHANGEMECHANGEMECHANGEMECHANGEME';
  	app.use(express.session({secret:session_secret}));
		app.use(express.methodOverride()); 				
	});

	app.configure('development', function() {
  	app.use(express.errorHandler());
  	mongoose.connect('mongodb://localhost/mixology-development');
	});

	var users = require('./api/routes/drinkRoutes');
	

	// Users routes
	// app.get('/api/v1/users', users.collection);

	app.get('/api/v1/getDrink/:ingredient/:tag', users.findById);
	app.post('/api/v1/createDrink', users.create);

	// app.put('/api/v1/users/:id', users.update);
	// app.delete('/api/v1/users/:id', users.destroy);
	

	var server = http.createServer(app);
	server.listen(3000, function() {
		console.log("App listening on port 3000");	
	})
	
=======
var express  = require('express');
var app      = express();
var http     = require('http');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });
});

app.configure(function() {
	app.use(express.static(__dirname + '/build'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	var session_secret = process.env.OAA_SESSION_SECRET || 'CHANGEMECHANGEMECHANGEMECHANGEME';
	app.use(express.session({secret:session_secret}));
	app.use(express.methodOverride());
});

app.configure('development', function() {
	app.use(express.errorHandler());
	mongoose.connect('mongodb://localhost/mixology-development');
});

var drinks = require('./api/routes/drinkRoutes');

// Users routes
//app.get('/', users.collection);

app.get('/api/v1/getDrink/:name/:tag', drinks.findById);
app.post('/api/v1/createDrink', drinks.create);

// app.put('/api/v1/users/:id', users.update);
// app.delete('/api/v1/users/:id', users.destroy);

var server = http.createServer(app);
server.listen(5000, function() {
	console.log('App listening on port 5000');
});

>>>>>>> 9f2aad957cf52d628b0205514d84a3148fc39b7c
