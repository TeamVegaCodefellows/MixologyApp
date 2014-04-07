module.exports = Backbone.Model.extend({
  url: "http://ianjohnson.co/signup/",
  defaults: {
    localEmail       : '',
    localPassword    : ''
  }
});
