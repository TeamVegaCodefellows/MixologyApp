var template = require('../../../templates/login.hbs');
var Login = require('../models/Login.js');

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
      var login = new Login({localEmail:email, localPassword:password});

      login.save([],{
        dataType:"text",
        success: function(model, response){
          if (response === "fail"){
            thiz.$('#badCredentials').html('wrong credentials');
          }
          else Backbone.history.navigate('/', {trigger:true});
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