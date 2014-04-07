var DrinkView = require('./DrinkView.js');
var SaveDrink = require('../models/SaveDrink.js');
var SavedItems = require('../models/SavedItems.js');

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
        if (response === "Saved!"){
          console.log(this.email);
          this.$(e.currentTarget).attr('disabled', true);
          this.$(e.currentTarget).html('Saved!');
        }
        if (response === "Duplicate"){
          alert('Drink already in your list');
        }
      }
    });
  },

	renderLoggedIn: function() {
    var thiz = this;
    var savedItems = new SavedItems();

    savedItems.set({localEmail:thiz.email});

    savedItems.save([], {
      success: function(model, response){
        console.log('length', thiz.collection.length);
        if (response.length !== 0){
          thiz.collection.each(function(drink){
            for (var each in response){
              console.log(response[each].name, drink.get('name'))
              if (response[each].name === drink.get('name')){
                var drinkView = new DrinkView({model:drink, match:true});
                break;
              }
              else{
                var drinkView = new DrinkView({model:drink, match:false});
              }
            }
            thiz.$el.append(drinkView.renderLoggedIn().el);
          },thiz);
        }
        else {
          thiz.renderNotLoggedIn();
        }
      }
    });
    return this;
	},

  renderNotLoggedIn: function() {
    this.collection.each(function(drink){
      var drinkView = new DrinkView({model:drink});
      this.$el.append(drinkView.renderNotLoggedIn().el);
    },this);
    return this;
  }

});