var DrinkView = require('./DrinkView.js');
var SaveDrink = require('../models/SaveDrink.js');

module.exports = Backbone.View.extend({
	tagName: 'div',

  events: {
    'click .recipeButton' : 'saveRecipe'
  },

  setLogin: function(login) {
    console.log('login', login);
    this.email = login;
  },

  saveRecipe: function(e){
    var saveDrink = new SaveDrink({
      drink: $(e.currentTarget).attr('class'),
      localEmail: this.email
    });
    saveDrink.save([], {
      dataType:'text',
      success: function(model, response){
        console.log('success!');
      }
    });
  },

	render: function() {
		this.collection.each(function(drink){
			var drinkView = new DrinkView({model:drink});
			this.$el.append(drinkView.el);
		},this);
		return this;
	}

});
