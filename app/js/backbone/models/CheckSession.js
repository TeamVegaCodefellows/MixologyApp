module.exports = Backbone.Model.extend({
  url: "http://127.0.0.1:3000/checkSession/",
	defaults: {
    localEmail: ""
	}
});
