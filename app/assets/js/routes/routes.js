var Backbone           = require('backbone');

module.exports = Backbone.Router.extend({

  routes: { '' : 'index',
          'results': 'results' },

  start: function(){
    Backbone.history.start({pushState: false});
  },

  initialize: function(){
    // this.drinksCollection = new DrinksCollection();
    // this.drinksCollectionView = new DrinksCollectionView({collection: this.drinksCollection});
  },

  index: function(){
    console.log("asdf");
  }

})
