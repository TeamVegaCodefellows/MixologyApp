'use strict';
//jshint unused:false

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../server').app;

describe('Drinks JSON api', function(){

  var entry = {name: 'Screwdriver',
    description: "Go to cocktail for parties",
    ingredients:"Vodka, Orange juice",
    directions: "Mix it together with ice",
    tag: "Classics",
    servings: 1,
    img: "https://www.google.com"
  };

  var entry1 = {name: 'Smooth sailin1',
    description: "type drink for the masses",
    ingredients:"Vodka, Whiskey",
    directions: "Do this, do that",
    tag: "Summer drink",
    servings: 2,
    img: "https://www.google.com"
  };

  var entry2 = {name: 'Smooth sailin2',
    description: "type drink for the masses",
    ingredients:"Cognac",
    directions: "Do this, do that",
    tag: "Summer drink",
    servings: 3,
    img: "https://www.google.com"
  };

  var bloodyMary = { name: 'Bloody Mary',
    description: 'This recipe for spicy, refreshing Bloody Marys is a perfect accompaniment to eggs benedict or other brunch favorites.',
    ingredients: '4 cups tomato juice Juice of 2 large lemons 1 to 2 tablespoons Worcestershire sauce 1 heaping tablespoon prepared horseradish 1 1/2 cloves garlic, passed through a garlic press 2 teaspoons coarsely ground pepper 1/4 to 1/2 teaspoon Tabasco sauce Unflavored vodka, to taste Lemon wedges, for serving Celery sticks, for serving and munching',
    directions: 'STEP 1 Place tomato juice in a large container with a tight-fitting lid. Add lemon juice, Worcestershire sauce, horseradish, garlic, pepper, and Tabasco; shake vigorously. Taste, and adjust for seasoning; the mixture should be quite spicy.  STEP 2 Pour 1 part vodka and 3 parts Bloody Mary mix over ice in a shaker. Shake well. Pour into glasses. Squeeze a wedge of lemon over drink (do not subsequently stir or shake drink), discard used wedge. Garnish with a large stick of celery (reserve extra stalks for munching) and a large lemon wedge.',
    tag: 'brunch',
    servings: 6,
    img: ''
  };

  it('can create a new drink', function(done){
    superagent.post('http://localhost:3000/api/v1/createDrink')
      .send(entry)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.name).to.be.eql('Screwdriver');
        expect(res.body.description).to.be.eql('Go to cocktail for parties');
        expect(res.body.ingredients).to.be.eql('Vodka, Orange juice');
        expect(res.body.directions).to.be.eql('Mix it together with ice');
        expect(res.body.tag).to.be.eql('Classics');
        expect(res.body.servings).to.be.eql(1);
        expect(res.body.img).to.be.eql('https://www.google.com'); 
        done();
      });
  });

  it('can create a new drink', function(done){
    superagent.post('http://localhost:3000/api/v1/createDrink')
      .send(entry1)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.name).to.be.eql(entry1.name);
        expect(res.body.description).to.be.eql(entry1.description);
        expect(res.body.ingredients).to.be.eql(entry1.ingredients);
        expect(res.body.directions).to.be.eql(entry1.directions);
        expect(res.body.tag).to.be.eql(entry1.tag);
        expect(res.body.servings).to.be.eql(entry1.servings);
        expect(res.body.img).to.be.eql(entry1.img);
        done();
      });
  });

  it('can create a new drink', function(done){
    superagent.post('http://localhost:3000/api/v1/createDrink')
      .send(entry2)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.name).to.be.eql(entry2.name);
        expect(res.body.description).to.be.eql(entry2.description);
        expect(res.body.ingredients).to.be.eql(entry2.ingredients);
        expect(res.body.directions).to.be.eql(entry2.directions);
        expect(res.body.tag).to.be.eql(entry2.tag);
        expect(res.body.servings).to.be.eql(entry2.servings);
        expect(res.body.img).to.be.eql(entry2.img);
        done();
      });
  });

  it('can find a drink', function(done){
    superagent.get('http://localhost:3000/api/v1/getDrink/' + 'brunch' + '/' + 'vodka').end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body[0].name).to.be.eql(bloodyMary.name);
        expect(res.body[0].description).to.be.eql(bloodyMary.description);
        expect(res.body[0].ingredients).to.be.eql(bloodyMary.ingredients);
        expect(res.body[0].directions).to.be.eql(bloodyMary.directions);
        expect(res.body[0].tag).to.be.eql(bloodyMary.tag);
        expect(res.body[0].servings).to.be.eql(bloodyMary.servings);
        expect(res.body[0].img).to.be.eql(bloodyMary.img);
        done();
    });
  });

});
