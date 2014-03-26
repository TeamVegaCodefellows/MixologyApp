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
        tag : String
      }
    ],
    second_option : [
      {
        label : String
      },
      {
        tag : String
      }
    ],
    third_option : [
      {
        label : String
      },
      {
        tag : String
      }
    ]

});

module.exports = mongoose.model('firstQuestion', schema);
