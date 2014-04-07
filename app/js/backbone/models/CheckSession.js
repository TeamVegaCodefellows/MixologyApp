module.exports = Backbone.Model.extend({
  url: "http://ianjohnson.co/checkSession/",
	defaults: {
    localEmail: ""
	}
});
