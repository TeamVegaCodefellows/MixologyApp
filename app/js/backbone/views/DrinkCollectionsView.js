var DrinkView = require('./DrinkView.js');
module.exports = Backbone.View.extend({
	tagName: 'div',

  events: {
    'click .recipeButton' : 'saveRecipe'
  },

  setLogin: function(login) {
    this.login = login;
    console.log(this.login);
  },

  saveRecipe: function(){
    alert('seems to work');
  },

	render: function() {
		this.collection.each(function(drink){
			var drinkView = new DrinkView({model:drink});
			this.$el.append(drinkView.el);
		},this);
		return this;
	}

});
