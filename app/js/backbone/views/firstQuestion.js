var template = require('../../../templates/firstQuestion.hbs');

module.exports = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	events: {
		'click #tag' : 'getTag'
	},

	getTag: function(e) {
		var tag = $(e.currentTarget).attr('class');
		Backbone.history.navigate('secondQuestion/'+ tag,
			{trigger:true});
	},

	render: function() {
		var index = template(this.model.toJSON());
		this.$el.html(index);
		return this;
	}

});
