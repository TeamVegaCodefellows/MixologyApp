var Drink = require('./models/Drink.js');
var DrinkView = require('./views/DrinkView.js');


var drink = new Drink({
	name:"Bloody Mary",
	ingredients: "Vodka",
	directions: "Mix vodka and tomatot juice",
	img: "http://www.google.com",
	tag: "brunch",
	description: "great for hangovers",
	servings: "2"	
});

var drinkView = new DrinkView({model:drink});
console.log(drinkView.el);
////
////
var DrinkCollection = require('./models/DrinkCollections.js');
var drinkCollections = new DrinkCollection([], {ingredient:'a', tag:'brunch'});
drinkCollections.fetch({
	success: function() {
		var DrinkCollectionsView = require('./views/DrinkCollectionsView');
		var drinkCollectionsView = new DrinkCollectionsView({collection:drinkCollections});
		$('body').append(drinkCollectionsView.el);
	}
});

