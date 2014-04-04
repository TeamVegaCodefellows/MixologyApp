module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/getSavedItems/",
	defaults: {
    localEmail: '',
    savedDrinks: []
	}
});
