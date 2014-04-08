module.exports = Backbone.Model.extend({
  url: "/login/",
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
