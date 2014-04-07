module.exports = Backbone.Model.extend({
  url: "http://ianjohnson.co/login/",
  defaults: {
    localEmail       : '',
    localPassword    : '',
    twitterId          : '',
    twitterToken       : '',
    twitterDisplayName : '',
    twitterUserName    : '',
    savedDrinks        : []
  }
});
