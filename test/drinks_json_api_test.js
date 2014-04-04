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

  var bloodyMary = { name: 'Berry Little Cocktail',
    description: 'Have yourself a Berry Little Cocktail. Stir up this light, bright drink with the tang of citrus and a splash of Champagne to add a festive fizz to your holiday bash.',
    ingredients: '1/2 cup sugar 1 cup fresh cranberries 1 ounce Charbay ruby red grapefruit vodka 2 ounces Champagne 1 ounce cranberry juice 1 ounce black currant juice',
    directions: 'In a medium saucepan over medium-high heat, dissolve sugar into 1 1/2 cups water. Add cranberries and simmer for 5 minutes, or until softened. Remove from heat and let cool. Strain, discard liquid, and place cranberries on a tray in the freezer for at least 2 hours. Chill vodka, Champagne, and juices, then mix in a champagne glass. Garnish with skewer of 4 or 5 frozen candied cranberries. Reserve the rest for another drink.',
    tag: 'classy',
    servings: 1,
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
    superagent.get('http://localhost:3000/api/v1/getDrink/' + 'classy' + '/' + 'champagne').end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body[0].name).to.not.be.eql(null);
        expect(res.body[0].tag).to.be.eql("classy");
        expect(res.body[0].servings).to.be.eql(1);
        expect(res.body[0].img).to.be.eql("");
        done();
    });
  });

});
