module.exports = Backbone.Model.extend({
  url: "/signup/",
  defaults: {
    localEmail       : '',
    localPassword    : ''
  }
});
