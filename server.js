var express  = require('express');
var app      = express();
var cons 		 = require('consolidate');
var http     = require('http');
var passport = require('passport');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var flash = require('connect-flash');
require('./config/passport')(passport); // pass for passport configuration

app.engine('hbs', cons.handlebars);
app.set('view engine', 'hbs')
app.set('views', __dirname + '/app/templates');

app.configure(function() {
	app.use(express.static(__dirname + '/build'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	var session_secret = process.env.OAA_SESSION_SECRET || 'CHANGEMECHANGEMECHANGEMECHANGEME';
	app.use(express.session({secret:session_secret}));
	app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(app.router);
});

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

require('./app/routes.js')(app, passport); // load routes and pass in app and fully configured passport

var drinks = require('./api/routes/drinkRoutes');
var questions = require('./api/routes/questionRoutes');

app.post('/api/v1/createFirstQuestion', questions.createFirstQuestion);
app.post('/api/v1/createSecondQuestion', questions.createSecondQuestion);
app.get('/api/v1/getFirstQuestion', questions.getFirstQuestion);
app.get('/api/v1/getSecondQuestion', questions.getSecondQuestion);
app.get('/api/v1/getDrink/:tag/:ingredient', drinks.findById);
app.post('/api/v1/createDrink', drinks.create);

//var server = require('./app/secureServer.js')(app,3000);

var server = http.createServer(app);
server.listen(3000, function() {
	console.log('App listening on port 3000');
});
