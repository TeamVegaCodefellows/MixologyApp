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
		this.$el.detach();
		Backbone.history.navigate( tag, { trigger:true } );
	},

	render: function() {
		var index = template(this.model.toJSON());
		this.$el.html(index);
    this.delegateEvents();
		return this;
	}

});
