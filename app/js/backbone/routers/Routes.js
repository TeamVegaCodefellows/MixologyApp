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

module.exports = Backbone.Router.extend({


    routes: {
        "test": "test",
        "login": "showLoginPage",
        "": "showFirstQuestion",
        ":tag": 'showSecondQuestion',
        "results/:tag/:ingredient": "getResults",
    },

    initialize: function () {
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

    test: function() {
      console.log(this.login);
    },

    showLoginPage: function () {
        this.login = new User();
        var loginView = new LoginView({model:this.login});
        console.log('this.login', this.login);
        $('.Question').empty();
        $('.Result').empty();
        $('.Result').append(loginView.el);
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
      var thiz = this;
      function renderDrinkCollection() {
            var drinkCollectionsView = new DrinkCollectionsView({
                collection: drinkCollection
            });
            drinkCollectionsView.setLogin(this.login);
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
