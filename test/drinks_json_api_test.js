'use strict';
//jshint unused:false

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../server').app;

describe('Users JSON api', function(){

  var id;

  var entry = {name: 'Smooth sailin',
    description: "Summery type drink for the masses",
    ingredients:"Vodka, Vermouth",
    directions: "Do this, do that",
    tag: "Summer drink",
    servings: '2',
    img: "https://www.google.com"
  };


  var entry1 = {name: 'Smooth sailin',
    description: "type drink for the masses",
    ingredients:"Vodka, Whiskey",
    directions: "Do this, do that",
    tag: "Summer drink",
    servings: '2',
    img: "https://www.google.com"
  };


  // it('can create a new drink', function(done){
  //   superagent.post('http://localhost:5000/api/v1/createDrink')
  //     .send(entry)
  //     .end(function(e, res){
  //       expect(e).to.eql(null);
  //       expect(res.body._id).to.not.be.eql(null);
  //       expect(res.body.name).to.be.eql('Smooth sailin');
  //       expect(res.body.description).to.be.eql('Summery type drink for the masses');
  //       expect(res.body.ingredients).to.be.eql('Vodka, Vermouth');
  //       expect(res.body.directions).to.be.eql('Do this, do that');
  //       expect(res.body.tag).to.be.eql('Summer drink');
  //       expect(res.body.img).to.be.eql('https://www.google.com');
  //       // id = res.body._id;

  //       done();
  //     });
  // });

  it('can create a new drink', function(done){
    superagent.post('http://localhost:5000/api/v1/createDrink')
      .send(entry1)
      .end(function(e, res){
        console.log(entry1);
        expect(e).to.eql(null);
        expect(res.body._id).to.not.be.eql(null);
        expect(res.body.name).to.be.eql('Smooth sailin');
        expect(res.body.description).to.be.eql('type drink for the masses');
        expect(res.body.ingredients).to.be.eql('Vodka, Whiskey');
        expect(res.body.directions).to.be.eql('Do this, do that');
        expect(res.body.tag).to.be.eql('Summer drink');
        expect(res.body.img).to.be.eql('https://www.google.com');
        // id = res.body._id;

        done();
      });
  });


  // it('can get users collection', function(done){
  //   superagent.get('http://localhost:5000/api/v1/users').end(function(e, res){
  //     expect(e).to.eql(null);
  //     expect(res.body.length).to.be.above(0);

  //     done();
  //   });
  // });

  it('can find a drink', function(done){
    superagent.get('http://localhost:5000/api/v1/getDrink/2').end(function(e, res){
      expect(e).to.eql(null);
      console.log(res.body);
      expect(res.body[0].name).to.be.eql('Smooth sailin');
      expect(res.body[0].description).to.be.eql('Summery type drink for the masses');
      // expect(res.body[0].ingredients).to.be.eql('Vodka, Vermouth');
      expect(res.body[0].directions).to.be.eql('Do this, do that');
      expect(res.body[0].tag).to.be.eql('Summer drink');
      expect(res.body[0].img).to.be.eql('https://www.google.com');

      done();
    });
  });


  // it('can get a single user', function(done){
  //   superagent.get('http://localhost:5000/api/v1/users/' + id).end(function(e, res){
  //     expect(e).to.eql(null);
  //     expect(res.body._id).to.be.eql(id);
  //     expect(res.body.first_name).to.be.eql('Ford');
  //     expect(res.body.last_name).to.be.eql('Prefect');

  //     done();
  //   });
  // });

  // it('can update a user', function(done){
  //   superagent.put('http://localhost:5000/api/v1/users/' + id).send({first_name: 'Arthur', last_name: 'Dent'})
  //   .end(function(e,res){
  //     expect(e).to.eql(null);
  //     expect(res.body.msg).to.be.eql('success');

  //     done();
  //   });
  // });

  // it('can delete a user' , function(done){
  //   superagent.del('http://localhost:5000/api/v1/users/' + id).end(function(e,res){
  //     expect(e).to.eql(null);
  //     expect(res.body.msg).to.be.eql('success');

  //     done();
  //   });
  // });

});
