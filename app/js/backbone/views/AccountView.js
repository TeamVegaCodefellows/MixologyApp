var template = require('../../../templates/myAccount.hbs');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

    events: {
		'click #myAccount' : 'showMyAccountPage'
	},    
    
   render: function() {
		var myAccountHtml = template("");
		this.$el.html(myAccountHtml);
		return this;
	}
});