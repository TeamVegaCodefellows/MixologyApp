module.exports = Backbone.View.extend({
	tagName: 'ul',
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = require('../../../templates/resultsView.hbs');
		this.$el.html(template(this.model.toJSON()));
		return this;
	}
});
