var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    localEmail       : String,
    localPassword    : String,
    twitterId          : String,
    twitterToken       : String,
    twitterDisplayName : String,
    twitterUserName    : String,
    savedDrinks        : []
});

// generate a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// verify password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.localPassword);

};

// create the model for users and expose it to our app

module.exports = mongoose.model('defaultuser', userSchema);
