var template = require('../../../templates/signup.hbs');
var SignUp = require('../models/SignUp.js');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

    events: {
    'click #signup' : 'signup'
    },

    signup: function(e) {
      e.preventDefault();
      var thiz = this;
      var email =  $(this.el).find('#emailInput').val();
      var password =  $(this.el).find('#passwordInput').val();
//      console.log('email:',email, 'password:', password);
//      alert('here');
//      return;
      var signUp = new SignUp({
        localEmail:email,
        localPassword:password
      });

      signUp.save([],{
        dataType: 'text',
        success: function(model, response){
          if(response === 'This user already exists'){
            thiz.$(e.currentTarget).html('User already exists');
          }
          else{
            thiz.model.set({localEmail:email});
            console.log('this.model', thiz.model);

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