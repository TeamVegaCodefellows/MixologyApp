var DrinkCollection = require('../models/DrinkCollection');
var DrinkCollectionView = require('../views/DrinkCollctionsView');

var Question = require('../models/Question');
var QuestionView = require('../views/QuestionView');

module.exports = Backbone.Router.extend(){

  routes: {
            '/question' : 'question',
            '/results' : 'results'
          },

  start: function(){
    Backbone.history.start();
  },

  initialize: function(){
    this.questionOne = new Question();
    this.questionOneView = new QuestionOneView({ model : this.questionOne });
  },

  question: function(){
    this.questionOne.fetch();
    this.questionOneView.render();
  },

  results: function(){
    this.drinkCollection = new DrinkCollection();
    this.drinkCollectionView = new DrinkCollectionView({ collection: this.drinkCollection });
    this.drinkCollection.fetch();
    this.drinkCollectionView.render();
  }

}
