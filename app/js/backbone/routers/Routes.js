var Drink = require('../models/Drink.js');
var DrinkCollection = require('../models/DrinkCollections.js');
var DrinkCollectionsView = require('../views/DrinkCollectionsView.js');
var IndexView = require('../views/IndexView.js');
var FirstQuestion = require('../models/FirstQuestion.js');
var SecondQuestion = require('../models/SecondQuestion.js');
var FirstQuestionView = require('../views/firstQuestion.js');
var SecondQuestionView = require('../views/secondQuestion.js');

module.exports = Backbone.Router.extend({
    routes: {
        "": "showFirstQuestion",
        "secondQuestion/:tag": 'showSecondQuestion',
        "results/:tag/:ingredient": "getResults"
    },

    initialize: function () {
        var indexView = new IndexView({
            model: {}
        });
        $('body').append(indexView.el);
    },

    showFirstQuestion: function () {
        var firstQuestion = new FirstQuestion();
        firstQuestion.fetch({
            success: function (model) {
                var firstQuestionView = new FirstQuestionView({
                    model: firstQuestion
                });
                $('.Result').empty();
                $('.Question').html(firstQuestionView.el);
            }
        });
    },

    showSecondQuestion: function (tag) {
        var secondQuestion = new SecondQuestion();
        secondQuestion.fetch({
            success: function (model) {
                var secondQuestionView = new SecondQuestionView({
                    model: secondQuestion,
                    tag: tag
                });
                $('.Result').empty();
                $('.Question').html(secondQuestionView.el);
            }
        })
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
        })
    },
});