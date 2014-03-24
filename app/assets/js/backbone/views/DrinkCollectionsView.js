module.exports = Backbone.View.extend({
	tagName: 'div',
	initialize: function() {
		this.collection.on('reset', this.render(), this);
	},
	render: function() {
		console.log('yo', this.collection);
		this.collection.each(function(models, another){
			console.log('never enters here?');
			console.log(models, this.model);
		},this);
	}

});
