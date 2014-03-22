'use strict';
//jshint unused:false

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../server').app;

describe('Users JSON api', function(){
  var id;

  it('can create a new user', function(done){
    superagent.post('http://localhost:3000/api/v1/users')
      .send({first_name: 'Ford', last_name: 'Prefect'})
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body._id).to.not.be.eql(null);
        expect(res.body.first_name).to.be.eql('Ford');
        expect(res.body.last_name).to.be.eql('Prefect');
        id = res.body._id;

        done();
      });
  });

  it('can get users collection', function(done){
    superagent.get('http://localhost:3000/api/v1/users').end(function(e, res){
      expect(e).to.eql(null);
      expect(res.body.length).to.be.above(0);

      done();
    });
  });

  it('can get a single user', function(done){
    superagent.get('http://localhost:3000/api/v1/users/' + id).end(function(e, res){
      expect(e).to.eql(null);
      expect(res.body._id).to.be.eql(id);
      expect(res.body.first_name).to.be.eql('Ford');
      expect(res.body.last_name).to.be.eql('Prefect');

      done();
    });
  });

  it('can update a user', function(done){
    superagent.put('http://localhost:3000/api/v1/users/' + id).send({first_name: 'Arthur', last_name: 'Dent'})
    .end(function(e,res){
      expect(e).to.eql(null);
      expect(res.body.msg).to.be.eql('success');

      done();
    });
  });

  it('can delete a user' , function(done){
    superagent.del('http://localhost:3000/api/v1/users/' + id).end(function(e,res){
      expect(e).to.eql(null);
      expect(res.body.msg).to.be.eql('success');

      done();
    });
  });
  
});