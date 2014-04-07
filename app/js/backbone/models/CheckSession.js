module.exports = Backbone.Model.extend({
  url: "/checkSession/",
	defaults: {
    localEmail: ""
	}
});
