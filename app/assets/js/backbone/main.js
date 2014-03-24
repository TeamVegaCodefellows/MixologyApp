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


