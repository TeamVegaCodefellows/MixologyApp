'use strict';
//jshint unused:false

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String,
  ingredients: String,
  directions: String,
  img: String,
  tag: String,
  description: String,
 	servings: Number
});

module.exports = mongoose.model('drink', schema);
