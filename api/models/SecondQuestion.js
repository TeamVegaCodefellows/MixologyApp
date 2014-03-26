'use strict';
//jshint unused:false

var mongoose = require('mongoose');

var schema = new mongoose.Schema({

    question : String,
    first_option : [
      {
        label : String
      },
      {
        ingredient : String
      }
    ],
    second_option : [
      {
        label : String
      },
      {
        ingredient : String
      }
    ],
    third_option : [
      {
        label : String
      },
      {
        ingredient : String
      }
    ],
    random : Number

});

module.exports = mongoose.model('secondquestions', schema);
