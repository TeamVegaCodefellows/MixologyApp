var Drink = require('../models/Drink.js');
var DrinkCollection = require('../models/DrinkCollections.js');
var DrinkCollectionsView = require('../views/DrinkCollectionsView.js');
var IndexView = require('../views/index.js');

module.exports = Backbone.Router.extend({
    routes: {
        "test/:id": "test",
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