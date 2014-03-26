'use strict';
/*global casper*/

casper.test.begin('users', 2, function suite(test) {

  casper.start('http://localhost:3000#questions/', function() {
    test.assertHttpStatus(200);
  });

  casper.then(function(){
    test.assertTitle('Toastie', 'title is Toastie');
  });

  casper.then(function(){
    test.assertVisible('p.questionOne', 'questionOne selector is visible');
  });

  casper.then(function(){
    test.assertVisible('p.answersOne', 'answersOne selector is visible');
  });

  casper.then(function() {
    this.click('button');
    console.log('click');
  });

  casper.then(function(){
    test.assertVisible('p.questionTwo', 'questionTwo selector is visible');
  });

  casper.then(function(){
    test.assertVisible('p.answersTwo', 'answersTwo selector is visible');
  });

  casper.then(function() {
    this.click('button');
    console.log('click');
  });

  casper.run(function(){
    test.done();
  });

});
