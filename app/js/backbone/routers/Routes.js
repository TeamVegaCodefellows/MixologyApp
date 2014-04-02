var Drink = require('../models/Drink.js');
var DrinkCollection = require('../models/DrinkCollections.js');
var DrinkCollectionsView = require('../views/DrinkCollectionsView.js');
var FirstQuestion = require('../models/FirstQuestion.js');
var SecondQuestion = require('../models/SecondQuestion.js');
var FirstQuestionView = require('../views/FirstQuestionView.js');
var SecondQuestionView = require('../views/SecondQuestionView.js');
var IndexView = require('../views/IndexView.js');

module.exports = Backbone.Router.extend({

    routes: {
        "": "showFirstQuestion",
        ":tag": 'showSecondQuestion',
        "results/:tag/:ingredient": "getResults"
    },

    initialize: function () {
        var indexView = new IndexView({
            model: {}
        });
        $('body').append(indexView.el);
        var that = this;
        this.firstQuestion = new FirstQuestion();
        this.firstQuestionView = new FirstQuestionView({
            model: this.firstQuestion
        });
        this.firstQuestion.fetch({
            success: function () {
                that.firstQuestionView.render();
            }
        });
        this.secondQuestion = new SecondQuestion();
    },

    showFirstQuestion: function () {
        $('.Result').empty();
        $('.Question').html(this.firstQuestionView.el);
    },

    showSecondQuestion: function (tag) {
        var that = this;
        this.secondQuestionView = new SecondQuestionView({
            model: this.secondQuestion
        });
        this.secondQuestion.fetch({
            success: function () {
                that.secondQuestionView.render();
            }
        });
        this.secondQuestionView.setTag(tag);
        $('.Result').empty();
        $('.Question').html(this.secondQuestionView.el);
    },

    getResults: function (tag, ingredient) {
        function renderDrinkCollection() {
            var drinkCollectionsView = new DrinkCollectionsView({
                collection: drinkCollection
            });
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
