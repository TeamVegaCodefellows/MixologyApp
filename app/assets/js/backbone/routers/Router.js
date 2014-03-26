var FirstQuestion = require('../models/Question');
var QuestionCollection = require('../models/QuestionCollection');
var QuestionCollectionView = require('../views/QuestionCollectionView');

module.exports = Backbone.Router.extend({

  routes: {
            '/questions' : 'questionOne',
            '/questions/:tag' : 'questionTwo',
            '/questions/:tag/:ingredient' : 'results'
          },

  start: function(){
    Backbone.history.start();
  },

  initialize: function(){
    this.questionOne = new FirstQuestion();
    this.questionOne.fetch();
    this.questionCollectionView = new QuestionCollectionView({ model : questionOne });
  },

  questionOne: function(){
    this.questionCollectionView.render();
  },

  questionTwo: function(){
    this.questionTwo = new Question();
    this.questionTwo.fetch();
    this.questionCollectionView.render();
  },

  results: function(){

  }

});
