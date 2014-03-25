var template = require('../../../templates/firstQuestion.hbs');
module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var firstQuestion = template("");
		this.$el.html(firstQuestion);
		return this;
	}
});
