var Drink = require('./Drink.js');

module.exports = Backbone.Collection.extend({

	initialize: function(models, options) {
		this.ingredient = options.ingredient;
		this.tag = options.tag;
		this.url = 'http://localhost:3000/api/v1/getDrink/'+this.ingredient+'/'+this.tag;
	},
<<<<<<< HEAD:app/assets/js/backbone/models/DrinkCollections.js

	model: Drink,

=======
	model: Drink
>>>>>>> e348e4fe82c4e45b87a04ffb0258750281ea016b:app/js/backbone/models/DrinkCollections.js
});
