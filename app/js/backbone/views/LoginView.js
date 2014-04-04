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
      var email =  $(this.el).find('#emailInput').val();
      var password =  $(this.el).find('#passwordInput').val();
      var login = new Login({localEmail:email, localPassword:password});

      login.save();



//      var thiz=this;
//      var email =  $(this.el).find('#emailInput').val();
//      var password =  $(this.el).find('#passwordInput').val();
//
//      $.ajax({
//        type: "POST",
//        url: "/login",
//        data: { email: email, password: password }
//      })
//      .success (function(data, textStatus, xhr ){
//        if (textStatus === 'success'){
//          $(this.el).off('click', '#login');
//          thiz.model.set({localEmail:email});
//          console.log('thiz.model',thiz.model);
//          thiz.trigger();
//          console.log(thiz.model);
//        }
//      })
//      .fail (function(message){
//        thiz.$('#badCredentials').html('wrong credentials');
//      });
	},

    trigger: function(message) {
      $(this.el).find('.loginForm').submit();
    },

	render: function() {
		var loginHtml = template("");
		this.$el.html(loginHtml);
		return this;
	}

});