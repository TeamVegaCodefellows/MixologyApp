var Drink = require('./Drink.js');
module.exports = Backbone.Collection.extend({
	initialize: function(models, options) {
		this.ingredient = options.ingredient;
		this.tag = options.tag
		this.url = 'http://localhost:3000/api/v1/getDrink/'+this.ingredient+'/'+this.tag
	},
	model: Drink,
});
