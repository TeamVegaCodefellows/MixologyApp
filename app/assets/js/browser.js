'use strict';
/*jshint unused:false */

// load jquery et all via browserify
var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');
Backbone.$   = $;

var Routes = require('./routes/routes.js');

$(function() {
  var routes = new Routes();
  routes.start();
});
