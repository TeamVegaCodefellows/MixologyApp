'use strict';
//jshint unused:false

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../server').app;

describe('Questions JSON api', function(){

  var entry = {
    "question" : "What's your favorite color?",
    "choices" : [
      {
        "label" : "Blue",
        "tag" : "Easy"
      },
      {
        "label" : "Black",
        "tag" : "Classy"
      },
      {
        "label" : "Red",
        "tag" : "Bold"
      }
    ]
  };

  var entry2 = {
    "question" : "What's your favorite food?",
    "choices" : [
      {
        "label" : "Pizza",
        "ingredient" : "Beer"
      },
      {
        "label" : "Pasta",
        "ingredient" : "Wine"
      },
      {
        "label" : "Steaks",
        "ingredient" : "Whiskey"
      }
    ]
  };

  var badEntry = { test : "This object is used  as malformed input to get coverage of the errors in questionsRoutes" };

  it('can create a new first question', function(done){
    superagent.post('http://localhost:3000/api/v1/createFirstQuestion')
      .send(entry)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.question).to.be.eql("What's your favorite color?");
        expect(res.body.choices[0].label).to.be.eql("Blue");
        done();
      });
  });

  it('can create a new second question', function(done){
    superagent.post('http://localhost:3000/api/v1/createSecondQuestion')
      .send(entry2)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.choices[0].label).to.be.eql("Pizza");
        done();
      });
  });

  it('can get a random first question', function(done){
    superagent.get('http://localhost:3000/api/v1/getFirstQuestion').end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.question).to.not.be.eql(null || undefined);
        done();
    });
  });

  it('can get a random second question', function(done){
    superagent.get('http://localhost:3000/api/v1/getSecondQuestion').end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.question).to.not.be.eql(null || undefined);
        done();
    });
  });

  it('can throw and describe errors on malformed input', function(done){
    superagent.post('http://localhost:3000/api/v1/createFirstQuestion')
      .send(badEntry)
      .end(function(e, res){
        expect(e).to.eql(null);
      });
  });

});
