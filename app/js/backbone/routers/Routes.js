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

module.exports = Backbone.Router.extend({


    routes: {
        "savedItems": "showSavedItems",
        "signup":"showSignupPage",
        "login": "showLoginPage",
        "": "showFirstQuestion",
        ":tag": 'showSecondQuestion',
        "results/:tag/:ingredient": "getResults",
    },

    initialize: function () {
      console.log('initialized');
      var thiz = this;

      this.login = new User();
      var checkSession = new CheckSession();
        checkSession.fetch({
          dataType:'text',
          success: function(model, response){
            thiz.login.set({localEmail:response});
          }
        });

        var indexView = new IndexView({
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

    showSavedItems: function() {
      var savedItemsView = new SavedItemsView();
      if (this.login !== undefined){
        savedItemsView.setLogin(this.login.get('localEmail'));
        savedItemsView.fetch();
      }
      else {
        alert('sign in first biotch');
        Backbone.history.navigate('/login', {trigger:true})
        return;
      }
      $('.Question').empty();
      $('.Result').empty();
      $('.Result').append(savedItemsView.el);
    },

    showLoginPage: function () {
//        this.login = new User();
        console.log('this.login', this.login);
        var loginView = new LoginView({model:this.login});
        $('.Question').empty();
        $('.Result').empty();
        $('.Result').append(loginView.el);
    },
    showSignupPage: function () {
        var signupView = new SignupView();
        $('.Question').empty();
        $('.Result').empty();
        $('.Result').append(signupView.el);
    },

    showFirstQuestion: function () {
      $('.Result').empty();
        $('.Question').html(this.firstQuestionView.el);
    },

    showSecondQuestion: function (tag) {
        this.secondQuestionView = new SecondQuestionView({
            model: this.secondQuestion
        });
        this.secondQuestionView.render();
        this.secondQuestionView.setTag(tag);
        $('.Result').empty();
        $('.Question').html(this.secondQuestionView.el);
    },

    getResults: function (tag, ingredient) {
      console.log('this.login', this.login);
      var thiz = this;
      function renderDrinkCollection() {
        var drinkCollectionsView = new DrinkCollectionsView({
                collection: drinkCollection
            });
            //check to see if this has been set
            if (thiz.login !== undefined){
              drinkCollectionsView.setLogin(thiz.login.get('localEmail'));
            }
            drinkCollectionsView.render();
            $('.Question').empty();
            $('.Result').html(drinkCollectionsView.el);
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
