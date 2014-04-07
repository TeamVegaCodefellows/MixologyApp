module.exports = Backbone.Model.extend({
  url: "http://ianjohnson.co/getSavedItems/",
	defaults: {
    localEmail: '',
    savedDrinks: []
	}
});
