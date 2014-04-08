var template = require('../../../templates/index.hbs');

module.exports = Backbone.View.extend({
	tagName: 'div',
	className: 'page',
	initialize: function() {
		this.render();
	},

	render: function() {
		var index = template("");
		this.$el.html(index);
		return this;
	}

});


       
   