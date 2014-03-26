var Question = require('./Question.js');

module.exports = Backbone.Collection.extend({

  initialize: function(models, options) {
    this.url = 'http://localhost:3000/api/v1/getQuestion'
  },

  model: Question,

});
