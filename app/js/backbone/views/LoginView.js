var template = require('../../../templates/login.hbs');

module.exports = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	events: {
		'click #login' : 'attemptLogin'
	},

	attemptLogin: function(e) {
		console.log("this works");
	},

	render: function() {
		var loginHtml = template("");
		this.$el.html(loginHtml);
		return this;
	}

});