'use strict';
var Drink = require('../models/Drink');

exports.findById = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var ingredient = req.params.ingredient;
  var tag  = req.params.tag;
  Drink.find({ ingredients: { $regex: ingredient, $options: 'i' }  , tag:tag}, function(err, responseDrink) {
    if(err) {
      res.send(500, {'error': err});
    } else {
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
