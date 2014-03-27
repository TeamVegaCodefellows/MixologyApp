var Drink = require('../models/Drink.js');
var DrinkCollection = require('../models/DrinkCollections.js');
var DrinkCollectionsView = require('../views/DrinkCollectionsView.js');
var IndexView = require('../views/index.js');
var FirstQuestion = require('../models/Question.js');
var FirstQuestionView = require('../views/firstQuestion.js');

module.exports = Backbone.Router.extend({
    routes: {
        "test": "test",
        "results/:ingredient/:tag": "getResults",
        "":"renderIndex"
    },
    initialize: function () {
        console.log('initialized');
    },
    
    renderIndex: function () {
        var indexView = new IndexView();
        $('body').empty();
        $('body').append(indexView.el);
    },

    test: function() {
        var firstQuestion = new FirstQuestion();
        firstQuestion.fetch({
            success: function(model){
                var firstQuestionView = new FirstQuestionView({model:firstQuestion});
                $('body').append(firstQuestionView.el);
            }
        });
    },

    getResults: function (ingredient, tag) {
        function renderDrinkCollection() {
            var drinkCollectionsView = new DrinkCollectionsView({
                collection: drinkCollection
            });
            $('body').empty();
            $('body').append(drinkCollectionsView.el);
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
