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
var drinkCollections = new DrinkCollection([], {ingredient:'b', tag:'classic'});
drinkCollections.fetch({
	success: function() {
		renderDrinkCollectionsView();
	}
});

function renderDrinkCollectionsView (){
		var DrinkCollectionsView = require('./views/DrinkCollectionsView');
		var drinkCollectionsView = new DrinkCollectionsView({collection:drinkCollections});
		$('body').append(drinkCollectionsView.el);
}

var Routes = require('./routers/Routes.js');
var routes = new Routes();
Backbone.history.start();

var FirstQuestion = require('./views/firstQuestion.js');
var firstQuestion = new FirstQuestion();
$('.firstQuestion').replaceWith(firstQuestion.el);
