module.exports = Backbone.Model.extend({
  url: "/getSavedItems/",
	defaults: {
    localEmail: '',
    savedDrinks: []
	}
});
