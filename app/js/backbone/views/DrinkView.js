module.exports = Backbone.View.extend({
	tagName: 'div',
	initialize: function(options) {
    this.options = options || {};
	},
	renderLoggedIn: function() {
    if (this.options.match === true){
      var template = require('../../../templates/resultsView_disabled.hbs');
      this.$el.html(template(this.model.toJSON()));
    }
    else{
      var template = require('../../../templates/resultsView.hbs');
      this.$el.html(template(this.model.toJSON()));
    }
		return this;
	},

  renderNotLoggedIn: function() {
    var template = require('../../../templates/resultsView.hbs');
    this.$el.html(template(this.model.toJSON()));
    return this;
  }

});
 