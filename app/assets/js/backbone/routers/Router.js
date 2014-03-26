var Question = require('../models/Question');
var QuestionCollection = require('../models/QuestionCollection');
var QuestionView = require('../views/QuestionView');

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

  },

  questionOne: function(){
    this.questionOne = new Question();
    this.questionOne.fetch();
    this.questionView = new QuestionView({ model : questionOne });
    this.questionView.render();
  },

  questionTwo: function(){
    this.questionTwo = new Question();
    this.questionTwo.fetch();
    this.questionView = new QuestionView({ model : questionOne });
    this.questionView.render();
  },

  results: function(){

  }

});
