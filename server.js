var express  = require('express');
var app      = express();
var http     = require('http');
var mongoose = require('mongoose');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var uristring =
process.env.MONGOLAB_URI ||
'mongodb://localhost/mixology-development';

var theport = process.env.PORT || 3000;

app.configure(function() {
	app.use(express.static(__dirname + '/build'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	var session_secret = process.env.OAA_SESSION_SECRET || 'CHANGEMECHANGEMECHANGEMECHANGEME';
	app.use(express.session({secret:session_secret}));
	app.use(express.methodOverride());
});

// mongoose.connect(uristring, function(err, res) {
// 	if(err) {
// 		console.log('ERROR connecting to: ' + uristring + '. ' + err);
// 	} else {
// 		console.log('Successfully connected to: ' + uristring);
// 	}
// });

// var users = require('./api/routes/drinkRoutes');

app.configure('development', function() {
	app.use(express.errorHandler());
	mongoose.connect('mongodb://localhost/mixology-development');
});


mongoose.connect(uristring, function(err, res) {
	if(err) {
		console.log('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
		console.log('Successfully connected to: ' + uristring);
	}
});


var drinks = require('./api/routes/drinkRoutes');
var questions = require('./api/routes/questionRoutes');

// Users routes
// app.get('/api/v1/users', users.collection);

app.post('/api/v1/createFirstQuestion', questions.createFirstQuestion);
app.post('/api/v1/createSecondQuestion', questions.createSecondQuestion);
app.get('/api/v1/getFirstQuestion', questions.getFirstQuestion);
app.get('/api/v1/getSecondQuestion', questions.getSecondQuestion);
app.get('/api/v1/getDrink/:ingredient/:tag', drinks.findById);
app.post('/api/v1/createDrink', drinks.create);

// app.put('/api/v1/users/:id', users.update);
// app.delete('/api/v1/users/:id', users.destroy);


var server = http.createServer(app);
server.listen(3000, function() {
	console.log("App listening on port 3000");
})
