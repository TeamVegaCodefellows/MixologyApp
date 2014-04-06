var template = require('../../../templates/login.hbs');
var User= require('../models/User.js');

module.exports = Backbone.View.extend({

	initialize: function() {
    this.loggedIn = false;
		this.render();
	},

	events: {
		'click #login' : 'attemptLogin'
	},

	attemptLogin: function(e) {
      e.preventDefault();
      var thiz = this
      var email =  $(this.el).find('#emailInput').val();
      var password =  $(this.el).find('#passwordInput').val();
      var login = new User({localEmail:email, localPassword:password});
      this.model.set({localEmail:email});

      login.save([],{
        dataType:"text",
        success: function(model, response){
          if (response === "fail"){
            thiz.$('#badCredentials').html('wrong credentials');
          }
          else {
            $('#loggedInName').html(thiz.model.get('localEmail'));
            Backbone.history.navigate('/', {trigger:true});
          }
        },
        error: function(model, response){
          console.log(model, response);
        }
      });
  },

	render: function() {
		var loginHtml = template("");
		this.$el.html(loginHtml);
		return this;
	}

});