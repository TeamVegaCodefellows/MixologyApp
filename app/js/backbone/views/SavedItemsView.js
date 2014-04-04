var template = require('../../../templates/savedItems.hbs');
var SavedItems = require('../models/SavedItems.js');

module.exports = Backbone.View.extend({
	initialize: function() {
    this.render();
  },

  setLogin: function(login){
    this.email = login;
    console.log(this.email);
  },

  fetch: function() {
    var savedItems = new SavedItems({localEmail:this.email});
    savedItems.fetch();
  },

	render: function() {
		var savedItemsHtml = template("");
		this.$el.html(savedItemsHtml);
		return this;
	}

});