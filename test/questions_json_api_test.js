'use strict';
//jshint unused:false

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../server').app;

describe('Questions JSON api', function(){

  var entry = {
    question : "Whats up?",
    first_option : [
      { label : "asdf" }, { tag : "asdf" }
    ],
    second_option : [
      { label : "asdf" }, { tag : "asdf" }
    ],
    third_option : [
      { label : "asdf" }, { tag : "asdf" }
    ]
  };

  it('can create a new first question', function(done){
    superagent.post('http://localhost:3000/api/v1/createQuestion')
      .send(entry)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.question).to.be.eql("Whats up?");
        done();
      });
  });

  it('can get a random first question', function(done){
    superagent.get('http://localhost:3000/api/v1/getFirstQuestion').end(function(e, res){
        expect(e).to.eql(null);
        console.log(res.body);
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
