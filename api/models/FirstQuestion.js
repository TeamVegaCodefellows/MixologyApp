'use strict';
//jshint unused:false

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    question : String,
    options : [
      {
        label: String,
        tag : String
      }
    ],
    random: Number
});

module.exports = mongoose.model('firstquestions', schema);
