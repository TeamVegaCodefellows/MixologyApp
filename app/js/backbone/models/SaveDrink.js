module.exports = Backbone.Model.extend({
  url: "http://ianjohnson.co/saveDrink/",
	defaults: {
    localEmail: "",
    drink: ""
	}
});
