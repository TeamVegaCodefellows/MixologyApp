var template = require('../../../templates/firstQuestion.hbs');

module.exports = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	render: function() {
		var index = template(this.model.toJSON());
		this.$el.html(index);
		return this;
	}

});
