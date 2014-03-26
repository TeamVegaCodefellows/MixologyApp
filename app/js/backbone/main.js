var Routes = require('./routers/Routes.js');
$(function() {
	var routes = new Routes();
	Backbone.history.start();
});
