module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/saveDrink/",
	defaults: {
    localEmail: "",
    drink: ""
	}
});
