module.exports = Backbone.Model.extend({
  url: "/saveDrink/",
	defaults: {
    localEmail: "",
    drink: ""
	}
});
