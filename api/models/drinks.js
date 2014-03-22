'use strict';
//jshint unused:false

var mongoose = require('mongoose');
// var bcrypt   = require('bcrypt-nodejs');

var schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  local: {
    email: String,
    password: String
  }
});

// generate a secure hash
// schema.methods.generateHash = function(password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// // checking if password is valid
// schema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.local.password);
// };

module.exports = mongoose.model('User', schema);
