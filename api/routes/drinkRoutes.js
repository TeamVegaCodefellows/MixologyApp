'use strict';
var Drink = require('../models/Drink');

exports.findById = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var ingredient = req.params.ingredient;
  var tag  = req.params.tag;
  Drink.find({ ingredients: { $regex: ingredient, $options: 'i' }  , tag:tag}, function(err, responseDrink) {
    if(err) {
      res.send(500, {'error': err});
    } else if (responseDrink.length === 0){
      var drink = {
        "name":"Bloody Mary",
        "description":"This recipe for spicy, refreshing Bloody Marys is a perfect accompaniment to eggs benedict or other brunch favorites.",
        "ingredients":"4 cups tomato juice Juice of 2 large lemons 1 to 2 tablespoons Worcestershire sauce 1 heaping tablespoon prepared horseradish 1 1/2 cloves garlic, passed through a garlic press 2 teaspoons coarsely ground pepper 1/4 to 1/2 teaspoon Tabasco sauce Unflavored vodka, to taste Lemon wedges, for serving Celery sticks, for serving and munching",
        "directions":"STEP 1 Place tomato juice in a large container with a tight-fitting lid. Add lemon juice, Worcestershire sauce, horseradish, garlic, pepper, and Tabasco; shake vigorously. Taste, and adjust for seasoning; the mixture should be quite spicy.  STEP 2 Pour 1 part vodka and 3 parts Bloody Mary mix over ice in a shaker. Shake well. Pour into glasses. Squeeze a wedge of lemon over drink (do not subsequently stir or shake drink), discard used wedge. Garnish with a large stick of celery (reserve extra stalks for munching) and a large lemon wedge.",
        "tag":"business",
        "servings":6,
        "img":""
      }
      res.send(drink);
    }
    else {
      res.send(responseDrink);
    }
  });
};

exports.create = function(req, res) {
  var drink = new Drink(req.body);
  drink.save(function(err, responseDrink) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(responseDrink);
    }
  });
};
