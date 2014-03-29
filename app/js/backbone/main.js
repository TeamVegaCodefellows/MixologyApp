var Routes = require('./routers/Routes.js');

$(function() {
	var routes = new Routes();
	Backbone.history.start();
});

// Routes.bind( "all", function() {
//   this.secondQuestionView.$el.detach();
// });

