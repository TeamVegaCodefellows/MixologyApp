var template = require('../../../templates/secondQuestion.hbs');

module.exports = Backbone.View.extend({

	initialize: function() {},

	events: {
		'click #ingredient' : 'getIngredient'
	},

	setTag: function(tag) {
		this.tag = tag;
	},

	getIngredient: function(e) {
		var ingredient = $(e.currentTarget).attr('class');
		Backbone.history.navigate( 'results/'+ this.tag +'/'+ ingredient, {trigger:true} );
	},

	render: function() {
		var index = template(this.model.toJSON());
		this.$el.html(index);

		this.delegateEvents();
		return this;
	}

});
