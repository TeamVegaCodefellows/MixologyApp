'use strict';
//jshint unused:false

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: String,
    description: String,
    ingredients: String,
    directions: String,
    tag: String,
    alcohol_tag: String,
    servings: Number,
    img: String,
    random: Number
});

module.exports = mongoose.model('drink', schema);
