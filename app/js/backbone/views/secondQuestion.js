var template = require('../../../templates/secondQuestion.hbs');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.options = options || {};
		this.render();
	},

	events: {
		'click #ingredient' : 'getIngredient'
	},

	getIngredient: function(e) {
		var ingredient = $(e.currentTarget).attr('class');
		console.log(ingredient, this.options.tag);
		Backbone.history.navigate('results/'+ this.options.tag +'/'+ ingredient,
			{trigger:true});
	},

	render: function() {
		var index = template(this.model.toJSON());
		this.$el.html(index);
		return this;
	}

});
