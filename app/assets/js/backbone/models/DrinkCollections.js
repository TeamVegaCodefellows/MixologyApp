var Drink = require('./Drink.js');
module.exports = Backbone.Collection.extend({
	model: Drink,
	url: 'http://localhost:3000/api/v1/getDrink/vodka/brunch'
});
