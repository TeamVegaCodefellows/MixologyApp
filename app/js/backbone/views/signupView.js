var template = require('../../../templates/signup.hbs');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

    events: {
		'click #createAccount' : 'showSignupPage'
	},    
    
   render: function() {
		var signupHtml = template("");
		this.$el.html(signupHtml);
		return this;
	}
});