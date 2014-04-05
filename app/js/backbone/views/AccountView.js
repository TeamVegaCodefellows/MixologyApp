var template = require('../../../templates/myAccount.hbs');

module.exports = Backbone.View.extend({
	initialize: function(options) {
    this.options = options || {};
    console.log(this.options.test);
		this.render();
	},

    events: {
		'click #editInfo' : 'editInfo'
	},    

    editInfo: function(e){
      e.preventDefault();
      var thiz = this;
      var verifyEmail = $(this.el).find('#verifyEmail').val();
      var verifyPassword = $(this.el).find('#verifyPassword').val();
      var newName = $(this.el).find('#newName').val();
      var newEmail = $(this.el).find('#newEmail').val();
      var newPassword = $(this.el).find('#newPassword').val();

      this.model.set({
        verifyEmail: verifyEmail,
        verifyPassword: verifyPassword,
        newName: newName,
        newEmail: newEmail,
        newPassword: newPassword
      });

      this.model.save([], {
        dataType:'text',
        success: function(model, response){
          if (response === 'Update ok!'){
            alert('Account details changed!');
            thiz.options.login.set({localEmail:newEmail});
            $('#loggedInName').html(newEmail);
            Backbone.history.navigate('/', {trigger:true});
          }
          if(response === 'Wrong password'){
            alert('Wrong password!');
          }
        }
      })

    },

   render: function() {
    var myAccountHtml = template("");
    this.$el.html(myAccountHtml);
    return this;
  }
});