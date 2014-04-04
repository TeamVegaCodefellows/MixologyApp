'use strict';
var Drink = require('../models/Drink');

exports.findById = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var ingredient = req.params.ingredient;
  var tag  = req.params.tag;
  Drink.find({ alcohol_tag: { $regex: ingredient, $options: 'i'}, tag: tag}, function(err, responseDrink) {
    if(err) {
      res.send(500, {'error': err});
    } else if (responseDrink.length === 0){
      Drink.count({}, function(err, count) {
        var rand = Math.ceil(Math.random() * count);
        console.log("random drink");
        Drink.findOne({random: rand}, function(err, drink) {
          if (err) { res.send({error: err});}
          else {
            res.send(drink);
          }
        });
      });
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
