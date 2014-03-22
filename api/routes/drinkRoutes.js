'use strict';
var User = require('../models/Drink');

exports.collection = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  User.find({}, function(err, users) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(JSON.stringify(users));
    }
  });
};

exports.findById = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  User.findOne({'_id': String(id)}, function(err, responseUser) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(responseUser);
    }
  });
};

exports.create = function(req, res) {
  var user = new User(req.body);
  user.save(function(err, responseUser) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(responseUser);
    }
  });
};

exports.update = function(req, res) {
  var id = req.params.id;
  delete req.body._id;
  var user = req.body;
  User.update({'_id': String(id)}, user, function(err){
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send({msg: 'success'});
    }
  });
};

exports.destroy = function(req, res) {
  var id = String(req.params.id);
  User.remove({'_id': id}, function(err){
    if(err){
      res.send(500, {'error': err});
    } else {
      res.send({'msg': 'success'});
    }
  });
};
