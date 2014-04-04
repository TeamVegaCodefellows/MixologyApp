module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/login/",
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
