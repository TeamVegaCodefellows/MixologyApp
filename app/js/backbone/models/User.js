var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    localEmail       : String,
    localPassword    : String,
    twitterId          : String,
    twitterToken       : String,
    twitterDisplayName : String,
    twitterUserName    : String,
    savedDrinks        : []
  }
});
