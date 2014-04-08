var template = require('../../../templates/myAccount.hbs');
var formValidation = require('../../Util/formValidation.js');
var Account_userName = require('../models/Account_userName.js');

module.exports = Backbone.View.extend({
  initialize: function(options) {
    this.options = options || {};
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
    var newPasswordVerify = $(this.el).find('#newPasswordVerify').val();

    if (formValidation(newName,newEmail,newPassword,newPasswordVerify)===false){
      return;
    }

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
          thiz.options.login.set({localEmail:newEmail.toLowerCase()});
          $('#loggedInName').html(newEmail);
          Backbone.history.navigate('/', {trigger:true});
        }
        if(response === 'Wrong password!'){
          $('#errors').html('Wrong verification password provided!');
        }
        if(response === 'Wrong email!'){
          $('#errors').html('Wrong verification email provided!');
        }
        if(response === 'The new email you entered already exists!'){
          $('#errors').html('The new email you entered already exists!');
        }
      }
    })
  },

  fetchUserName: function() {
    var account_UserName = new Account_userName();
    account_UserName.fetch({
      success: function(){
        this.$('#userName').replaceWith(account_UserName.get('name'));
      }
    });
  },

  render: function() {
    var myAccountHtml = template("");
    this.$el.html(myAccountHtml);
    this.fetchUserName();
    return this;
  }
});