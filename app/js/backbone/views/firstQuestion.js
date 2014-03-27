var template = require('../../../templates/firstQuestion.hbs');

module.exports = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	render: function() {
		console.log(this.model.toJSON());
		var index = template(this.model.toJSON());
		// console.log(index);
		this.$el.html(index);
		return this;
	}

});
