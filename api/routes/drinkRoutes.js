'use strict';
var Drink = require('../models/Drink');

// exports.collection = function(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   User.find({}, function(err, users) {
//     if(err) {
//       res.send(500, {'error': err});
//     } else {
//       res.send(JSON.stringify(users));
//     }
//   });
// };

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

// exports.update = function(req, res) {
//   var id = req.params.id;
//   delete req.body._id;
//   User.update({'_id': String(id)}, user, function(err){
//   var user = req.body;
//     if(err) {
//       res.send(500, {'error': err});
//     } else {
//       res.send({msg: 'success'});
//     }
//   });
// };

// exports.destroy = function(req, res) {
//   var id = String(req.params.id);
//   User.remove({'_id': id}, function(err){
//     if(err){
//       res.send(500, {'error': err});
//     } else {
//       res.send({'msg': 'success'});
//     }
//   });
// };
