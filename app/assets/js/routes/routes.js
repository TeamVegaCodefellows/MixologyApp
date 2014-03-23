module.exports = Backbone.Router.extend({

  routes: { '' : 'index',
          'results': 'results' },

  index: function(){
    $('.mainContent').replaceWith(this.userListView.el);
  },

  initialize: function(){
    this.drinksCollection = new DrinksCollection();
    this.drinksCollectionView = new DrinksCollectionView({collection: this.drinksCollection});
  }

})
