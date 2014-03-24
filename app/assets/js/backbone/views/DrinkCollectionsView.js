module.exports = Backbone.View.extend({
	tagName: 'div',
	initialize: function() {
		this.collection.on('reset', this.render(), this);
	},
	render: function() {
		var temp = this.collection;
		console.log(temp);
		temp.each(function(models, another){
			console.log('never enters here?');
			console.log(models, this.model);
		},this);
	}

});
