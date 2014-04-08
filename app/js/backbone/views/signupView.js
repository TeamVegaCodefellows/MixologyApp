var template = require('../../../templates/signup.hbs');
var SignUp = require('../models/SignUp.js');
var formValidation = require('../../Util/formValidation.js');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

    events: {
      'click #signup' : 'signup',
      'click #Cancel' : 'cancel'
    },

    cancel: function(e){
      e.preventDefault();
      Backbone.history.navigate('/', {trigger:true});
    },

    signup: function(e) {
      e.preventDefault();
      var thiz = this;
      var name = $(this.el).find('#name').val();
      var email =  $(this.el).find('#emailInput').val();
      var password =  $(this.el).find('#passwordInput').val();
      var verifyPassword =  $(this.el).find('#verifyPassword').val();

      if (formValidation(name,email,password,verifyPassword)===false){
        return;
      }

      var signUp = new SignUp({
        name:name,
        localEmail:email,
        localPassword:password
      });

      signUp.save([],{
        dataType: 'text',
        success: function(model, response){
          if(response === 'This user already exists'){
            thiz.$('#errors').html('User already exists');
          }
          else{
            thiz.model.set({localEmail:email});
            console.log('this.model', thiz.model);

            $('#loggedInName').html(thiz.model.get('localEmail'));
            Backbone.history.navigate('/', {trigger:true});
          }
        }
      });

    },


    render: function() {
      var signupHtml = template("");
      this.$el.html(signupHtml);
      return this;
    }
});
