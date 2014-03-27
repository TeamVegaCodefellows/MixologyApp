var template = require('../../../templates/index.hbs');
var FirstQuestion = require('./firstQuestion.js');

module.exports = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	render: function() {
		var index = template("");
		this.$el.html(index);
    var firstQuestion = new FirstQuestion();
    this.$el.append(firstQuestion.el);
		return this;
	}

});
