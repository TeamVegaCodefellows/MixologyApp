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
    if (this.email === undefined || this.email === ''){
      Backbone.history.navigate('/login', {trigger:true});
    }
    var saveDrink = new SaveDrink({
      drink: this.$(e.currentTarget).parent().prev().find('.cocktailTitle').text(),
      localEmail: this.email
    });

    saveDrink.save([], {
      dataType:'text',
      success: function(model, response){
        if (response === "Saved"){

        }
        if (response === "Duplicate"){
          alert('Drink already in your list');
        }
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
