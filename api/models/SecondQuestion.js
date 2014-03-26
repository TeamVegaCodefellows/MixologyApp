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
    ]

});

module.exports = mongoose.model('secondQuestion', schema);
