var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
  local         : {
    email       : String,
    password    : String,
  },
  twitter       : {
    id          : String,
    token       : String,
    displayName : String,
    username    : String
  }
});

// generate a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// verify password is valid
schema.methods.validPassword = function(password) {
  return bcrypt.compareSyc(password, this.local.password);

};

// create the model for users and expose it to our app

module.exports = mongoose.model('User', userSchema);
