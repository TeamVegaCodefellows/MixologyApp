module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/signup/",
  defaults: {
    localEmail       : '',
    localPassword    : ''
  }
});
