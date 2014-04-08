var Drink = require('../models/Drink.js');
var DrinkCollection = require('../models/DrinkCollections.js');
var DrinkCollectionsView = require('../views/DrinkCollectionsView.js');
var FirstQuestion = require('../models/FirstQuestion.js');
var SecondQuestion = require('../models/SecondQuestion.js');
var FirstQuestionView = require('../views/FirstQuestionView.js');
var SecondQuestionView = require('../views/SecondQuestionView.js');
var IndexView = require('../views/IndexView.js');
var User = require('../models/User.js');
var LoginView = require('../views/LoginView.js');
var SavedItemsView = require('../views/SavedItemsView.js');
var CheckSession = require('../models/CheckSession.js');
var SignupView = require('../views/signupView.js');
var Account = require('../models/Account.js');
var AccountView = require('../views/AccountView.js');

module.exports = Backbone.Router.extend({

  routes: {
    "myAccount":"showMyAccountPage",
    "savedItems": "showSavedItems",
    "signup":"showSignupPage",
    "login": "showLoginPage",
    "": "showFirstQuestion",
    ":tag": 'showSecondQuestion',
    "results/:tag/:ingredient": "getResults"

  },

  initialize: function () {
    console.log('initialized');
    this.checkSession();
    var thiz = this;

    this.login = new User();
    this.checkSession();

    var indexView;
    indexView = new IndexView({
      model: {}
    });
    $('body').append(indexView.el);
    this.firstQuestion = new FirstQuestion();
    this.firstQuestionView = new FirstQuestionView({
      model: this.firstQuestion
    });
    var that = this;
    this.firstQuestion.fetch({
      success: function () {
        that.firstQuestionView.render();
      }
    });
    this.secondQuestion = new SecondQuestion();
    this.secondQuestion.fetch();

  },

  checkSession: function() {
    var thiz = this;
    var checkSession = new CheckSession();
    checkSession.fetch({
      dataType:'text',
      success: function(model, response){
        thiz.login.set({localEmail:response});
        $('#loggedInName').html(thiz.login.get('localEmail'));
      }
    });
  },

  showSavedItems: function() {
    var savedItemsView = new SavedItemsView();

    if (this.login.get('localEmail') === ''){
      Backbone.history.navigate('/login', {trigger:true})
      return;
    }
    else{
      savedItemsView.setLogin(this.login.get('localEmail'));
      savedItemsView.fetch();
      $('.Question').empty();
      $('.Result').empty();
      $('.Result').append(savedItemsView.el);
    }

  },

  showLoginPage: function () {
    var loginView = new LoginView({model:this.login});
    $('.Question').empty();
    $('.Result').empty();
    $('.Result').append(loginView.el);
  },
  showSignupPage: function () {
    var signupView = new SignupView({model:this.login});
    $('.Question').empty();
    $('.Result').empty();
    $('.Result').append(signupView.el);
  },
  showMyAccountPage: function () {
    if (this.login.get('localEmail') === ''){
      Backbone.history.navigate('/login', {trigger:true})
      return;
    }
    else{
      var account = new Account();
      var accountView = new AccountView({model:account, login:this.login});
      $('.Question').empty();
      $('.Result').empty();
      $('.Result').append(accountView.el);
    }
  },

  showFirstQuestion: function () {
    console.log('OK!');
    this.checkSession();
    $('.Result').empty();
    this.firstQuestionView.render();
    console.log('firstQuestion', this.firstQuestionView.el);
    $('.Question').html(this.firstQuestionView.el);
  },

  showSecondQuestion: function (tag) {
    this.checkSession();
    this.secondQuestionView = new SecondQuestionView({
      model: this.secondQuestion
    });
    this.secondQuestionView.render();
    this.secondQuestionView.setTag(tag);
    $('.Result').empty();
    $('.Question').html(this.secondQuestionView.el);
  },

  getResults: function (tag, ingredient) {
    this.checkSession();
    var thiz = this;
    function renderDrinkCollection() {
      var drinkCollectionsView = new DrinkCollectionsView({
        collection: drinkCollection
      });
      //check to see if this has been set

      if (thiz.login.get('localEmail') === ''){
//            drinkCollectionsView.setLogin(thiz.login.get('localEmail'));
        drinkCollectionsView.renderNotLoggedIn();
        $('.Question').empty();
        $('.Result').html(drinkCollectionsView.el);
      }
      else{
        drinkCollectionsView.setLogin(thiz.login.get('localEmail'));
        drinkCollectionsView.renderLoggedIn();
        $('.Question').empty();
        $('.Result').html(drinkCollectionsView.el);
      }
    }
    var drinkCollection = new DrinkCollection([], {
      tag: tag,
      ingredient: ingredient
    });
    drinkCollection.fetch({
      success: function (model) {
        renderDrinkCollection();
      }
    });
  },
});
