var template = require('../../../templates/savedItems.hbs');
var SavedItems = require('../models/SavedItems.js');

module.exports = Backbone.View.extend({
  initialize: function() {
  },

  setLogin: function(login){
    this.email = login;
  },

  fetch: function() {
    var thiz = this;
    var savedItems = new SavedItems({localEmail:this.email});
    //using save here - could not pass payload with
    //fetch/get request
    savedItems.save(null, {
      success: function(model, response){
        thiz.databaseReturn = response;
        thiz.render();
      }
    });
  },

  render: function() {
    var thiz = this;
    var savedItemsHtml = template(thiz.databaseReturn);
    this.$el.html(savedItemsHtml);
    return this;
  }

});