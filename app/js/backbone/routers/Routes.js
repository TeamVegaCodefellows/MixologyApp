var Drink = require('../models/Drink.js');
var DrinkCollection = require('../models/DrinkCollections.js');
var DrinkCollectionsView = require('../views/DrinkCollectionsView.js');
var IndexView = require('../views/IndexView.js');
var FirstQuestion = require('../models/Question.js');
var FirstQuestionView = require('../views/firstQuestion.js');

module.exports = Backbone.Router.extend({
    routes: {
        "results/:ingredient/:tag": "getResults",
        "":"showFirstQuestion"
    },

    initialize: function () {
        console.log('initialized');
    },
    
    showFirstQuestion: function() {
        var firstQuestion = new FirstQuestion();
        firstQuestion.fetch({
            success: function(model){
                var firstQuestionView = new FirstQuestionView({
                  model:firstQuestion
                });
                $('.Result').empty();
                $('.Question').html(firstQuestionView.el);
            }
        });
    },

    getResults: function (ingredient, tag) {
        function renderDrinkCollection() {
            var drinkCollectionsView = new DrinkCollectionsView({
                collection: drinkCollection
            });
            $('.Question').empty();
            $('.Result').html(drinkCollectionsView.el);
        }

        var drinkCollection = new DrinkCollection([], {
            ingredient: ingredient,
            tag: tag
        });
        drinkCollection.fetch({
            success: function (model) {
                renderDrinkCollection();
            }
        })
    },
});
