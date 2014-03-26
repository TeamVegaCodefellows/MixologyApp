'use strict';
//jshint unused:false

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../server').app;

describe('Questions JSON api', function(){

  var entry = {
    "question" : "this is a first question",
    "first_option" : [
      {
        "label" : "test",
        "tag" : "test"
      },
      {
        "label" : "test",
        "tag" : "test"
      },
      {
        "label" : "test",
        "tag" : "test"
      }
    ],
    "random" : 3
  };

  var entry2 = {
    "question" : "this is a second question",
    "first_option" : [
      {
        "label" : "test",
        "ingredient" : "test"
      },
      {
        "label" : "test",
        "ingredient" : "test"
      },
      {
        "label" : "test",
        "ingredient" : "test"
      }
    ],
    "random" : 3
  };

  it('can create a new first question', function(done){
    superagent.post('http://localhost:3000/api/v1/createFirstQuestion')
      .send(entry)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.question).to.be.eql("this is a first question");
        console.log(res.body);
        expect(res.body.first_option[0].label).to.not.be.eql(null || undefined);
        done();
      });
  });

  it('can create a new second question', function(done){
    superagent.post('http://localhost:3000/api/v1/createSecondQuestion')
      .send(entry2)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.question).to.be.eql("this is a second question");
        done();
      });
  });

  it('can get a random first question', function(done){
    superagent.get('http://localhost:3000/api/v1/getFirstQuestion').end(function(e, res){
        expect(e).to.eql(null);
        console.log(res.body.question);
        expect(res.body.question).to.not.be.eql(null || undefined);
        done();
    });
  });

  it('can get a random second question', function(done){
    superagent.get('http://localhost:3000/api/v1/getSecondQuestion').end(function(e, res){
        expect(e).to.eql(null);
        console.log(res.body.question);
        expect(res.body.question).to.not.be.eql(null || undefined);
        done();
    });
  });

});