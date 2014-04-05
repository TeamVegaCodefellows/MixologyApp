(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Routes = require('./routers/Routes.js');

$(function() {
	var routes = new Routes();
	Backbone.history.start();
});

},{"./routers/Routes.js":11}],2:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/checkSession/",
	defaults: {
    localEmail: ""
	}
});

},{}],3:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	defaults: {
    name: "",
    description: "",
		ingredients: "",
		directions: "",
		tag: "",
		servings: "",
		img: ""
	}
});

},{}],4:[function(require,module,exports){
var Drink = require('./Drink.js');

module.exports = Backbone.Collection.extend({

	initialize: function(models, options) {
		this.ingredient = options.ingredient;
		this.tag = options.tag;
		this.url = 'http://localhost:3000/api/v1/getDrink/'+this.tag+'/'+this.ingredient;
	},

	model: Drink

});

},{"./Drink.js":3}],5:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: "http://localhost:3000/api/v1/getFirstQuestion/",
	defaults: {
		"question" : "",
		"choices" : [
			{
				"label" : "",
				"tag" : ""
			},
			{
				"label" : "",
				"tag" : ""
			},
			{
				"label" : "",
				"tag" : ""
			}
		],
		"random" : ""
	}
});

},{}],6:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/saveDrink/",
	defaults: {
    localEmail: "",
    drink: ""
	}
});

},{}],7:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/getSavedItems/",
	defaults: {
    localEmail: '',
    savedDrinks: []
	}
});

},{}],8:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: "http://localhost:3000/api/v1/getSecondQuestion/",
	defaults: {
		"question" : "",
		"choices" : [
			{
				"label" : "",
				"tag" : ""
			},
			{
				"label" : "",
				"tag" : ""
			},
			{
				"label" : "",
				"tag" : ""
			}
		],
		"random" : ""
	}
});

},{}],9:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/signup/",
  defaults: {
    localEmail       : '',
    localPassword    : ''
  }
});

},{}],10:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/login/",
  defaults: {
    localEmail       : '',
    localPassword    : '',
    twitterId          : '',
    twitterToken       : '',
    twitterDisplayName : '',
    twitterUserName    : '',
    savedDrinks        : []
  }
});

},{}],11:[function(require,module,exports){
var Drink = require('../models/Drink.js');
var DrinkCollection = require('../models/DrinkCollections.js');
var DrinkCollectionsView = require('../views/DrinkCollectionsView.js');
var FirstQuestion = require('../models/FirstQuestion.js');
var SecondQuestion = require('../models/SecondQuestion.js');
var FirstQuestionView = require('../views/FirstQuestionView.js');
var SecondQuestionView = require('../views/SecondQuestionView.js');
var IndexView = require('../views/IndexView.js');
var User = require('../models/User.js');
var LoginView = require('../views/LoginView.js');
var SavedItemsView = require('../views/SavedItemsView.js');
var CheckSession = require('../models/CheckSession.js');
var SignupView = require('../views/signupView.js');
var AccountView = require('../views/AccountView.js');

module.exports = Backbone.Router.extend({


    routes: {
        "myAccount":"showMyAccountPage",
        "savedItems": "showSavedItems",
        "signup":"showSignupPage",
        "login": "showLoginPage",
        "": "showFirstQuestion",
        ":tag": 'showSecondQuestion',
        "results/:tag/:ingredient": "getResults",
    },

    initialize: function () {
      console.log('initialized');
      var thiz = this;

      this.login = new User();
      var checkSession = new CheckSession();
        checkSession.fetch({
          dataType:'text',
          success: function(model, response){
            thiz.login.set({localEmail:response});
          }
        });

        var indexView = new IndexView({
            model: {}
        });
        $('body').append(indexView.el);
        this.firstQuestion = new FirstQuestion();
        this.firstQuestionView = new FirstQuestionView({
            model: this.firstQuestion
        });
        var that = this;
        this.firstQuestion.fetch({
            success: function () {
                that.firstQuestionView.render();
            }
        });
        this.secondQuestion = new SecondQuestion();
        this.secondQuestion.fetch();
    },

    showSavedItems: function() {
      var savedItemsView = new SavedItemsView();
      console.log(this.login);
      if (this.login.localEmail !== '' ){
        savedItemsView.setLogin(this.login.get('localEmail'));
        savedItemsView.fetch();
      }
      else {
        Backbone.history.navigate('/login', {trigger:true})
        return;
      }
      $('.Question').empty();
      $('.Result').empty();
      $('.Result').append(savedItemsView.el);
    },

    showLoginPage: function () {
//        this.login = new User();
        console.log('this.login', this.login);
        var loginView = new LoginView({model:this.login});
        $('.Question').empty();
        $('.Result').empty();
        $('.Result').append(loginView.el);
    },
    showSignupPage: function () {
        var signupView = new SignupView();
        $('.Question').empty();
        $('.Result').empty();
        $('.Result').append(signupView.el);
    },
    showMyAccountPage: function () {
        var accountView = new AccountView();
        $('.Question').empty();
        $('.Result').empty();
        $('.Result').append(accountView.el);
    },

    showFirstQuestion: function () {
      $('.Result').empty();
        $('.Question').html(this.firstQuestionView.el);
    },

    showSecondQuestion: function (tag) {
        this.secondQuestionView = new SecondQuestionView({
            model: this.secondQuestion
        });
        this.secondQuestionView.render();
        this.secondQuestionView.setTag(tag);
        $('.Result').empty();
        $('.Question').html(this.secondQuestionView.el);
    },

    getResults: function (tag, ingredient) {
      console.log('this.login', this.login);
      var thiz = this;
      function renderDrinkCollection() {
        var drinkCollectionsView = new DrinkCollectionsView({
                collection: drinkCollection
            });
            //check to see if this has been set
            if (thiz.login !== undefined){
              drinkCollectionsView.setLogin(thiz.login.get('localEmail'));
            }
            drinkCollectionsView.render();
            $('.Question').empty();
            $('.Result').html(drinkCollectionsView.el);
        }
        var drinkCollection = new DrinkCollection([], {
            tag: tag,
            ingredient: ingredient
        });
        drinkCollection.fetch({
            success: function (model) {
                renderDrinkCollection();
            }
        });
    },
});

},{"../models/CheckSession.js":2,"../models/Drink.js":3,"../models/DrinkCollections.js":4,"../models/FirstQuestion.js":5,"../models/SecondQuestion.js":8,"../models/User.js":10,"../views/AccountView.js":12,"../views/DrinkCollectionsView.js":13,"../views/FirstQuestionView.js":15,"../views/IndexView.js":16,"../views/LoginView.js":17,"../views/SavedItemsView.js":18,"../views/SecondQuestionView.js":19,"../views/signupView.js":20}],12:[function(require,module,exports){
var template = require('../../../templates/myAccount.hbs');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

    events: {
		'click #myAccount' : 'showMyAccountPage'
	},    
    
   render: function() {
		var myAccountHtml = template("");
		this.$el.html(myAccountHtml);
		return this;
	}
});
},{"../../../templates/myAccount.hbs":24}],13:[function(require,module,exports){
var DrinkView = require('./DrinkView.js');
var SaveDrink = require('../models/SaveDrink.js');

module.exports = Backbone.View.extend({
	tagName: 'div',

  events: {
    'click .recipeButton' : 'saveRecipe'
  },

  setLogin: function(login) {
    console.log('login', login);
    this.email = login;
  },

  saveRecipe: function(e){
    if (this.email === undefined || this.email === ''){
      alert('You have to login first!');
      Backbone.history.navigate('/login', {trigger:true});
    }
    var saveDrink = new SaveDrink({
      drink: this.$(e.currentTarget).parent().prev().find('.cocktailTitle').text(),
      localEmail: this.email
    });

    saveDrink.save([], {
      dataType:'text',
      success: function(model, response){
        if (response === "Saved"){

        }
        if (response === "Duplicate"){
          alert('Drink already in your list');
        }
      }
    });
  },

	render: function() {
		this.collection.each(function(drink){
			var drinkView = new DrinkView({model:drink});
			this.$el.append(drinkView.el);
		},this);
		return this;
	}

});

},{"../models/SaveDrink.js":6,"./DrinkView.js":14}],14:[function(require,module,exports){
module.exports = Backbone.View.extend({
	tagName: 'div',
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = require('../../../templates/resultsView.hbs');
		this.$el.html(template(this.model.toJSON()));
		return this;
	}
});

},{"../../../templates/resultsView.hbs":25}],15:[function(require,module,exports){
var template = require('../../../templates/firstQuestion.hbs');

module.exports = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	events: {
		'click #tag' : 'getTag'
	},

	getTag: function(e) {
		var tag = $(e.currentTarget).attr('class');
		this.$el.detach();
		Backbone.history.navigate( tag, { trigger:true } );
	},

	render: function() {
		var index = template(this.model.toJSON());
		this.$el.html(index);
		return this;
	}

});

},{"../../../templates/firstQuestion.hbs":21}],16:[function(require,module,exports){
var template = require('../../../templates/index.hbs');

module.exports = Backbone.View.extend({
	tagName: 'div',
	className: 'page',
	initialize: function() {
		this.render();
	},

	render: function() {
		var index = template("");
		this.$el.html(index);
		return this;
	}

});

},{"../../../templates/index.hbs":22}],17:[function(require,module,exports){
var template = require('../../../templates/login.hbs');
var User= require('../models/User.js');

module.exports = Backbone.View.extend({

	initialize: function() {
    this.loggedIn = false;
		this.render();
	},

	events: {
		'click #login' : 'attemptLogin'
	},

	attemptLogin: function(e) {
      e.preventDefault();
      var thiz = this
      var email =  $(this.el).find('#emailInput').val();
      var password =  $(this.el).find('#passwordInput').val();
      var login = new User({localEmail:email, localPassword:password});
      this.model.set({localEmail:email});

      login.save([],{
        dataType:"text",
        success: function(model, response){
          if (response === "fail"){
            thiz.$('#badCredentials').html('wrong credentials');
          }
          else {
            Backbone.history.navigate('/', {trigger:true});
          }
        },
        error: function(model, response){
          console.log(model, response);
        }
      });
  },

	render: function() {
		var loginHtml = template("");
		this.$el.html(loginHtml);
		return this;
	}

});
},{"../../../templates/login.hbs":23,"../models/User.js":10}],18:[function(require,module,exports){
var template = require('../../../templates/savedItems.hbs');
var SavedItems = require('../models/SavedItems.js');

module.exports = Backbone.View.extend({
	initialize: function() {
  },

  setLogin: function(login){
    this.email = login;
    console.log(this.email);
  },

  fetch: function() {
    var thiz = this;
    var savedItems = new SavedItems({localEmail:this.email});
    console.log('savedItems', savedItems);
    //using save here - could not pass payload with
    //fetch/get request
    savedItems.save(null, {
      success: function(model, response){
      console.log(response);
      thiz.databaseReturn = response;
      thiz.render();
      }
    });
  },

	render: function() {
    var thiz = this;
		var savedItemsHtml = template(thiz.databaseReturn);
		this.$el.html(savedItemsHtml);
		return this;
	}

});
},{"../../../templates/savedItems.hbs":26,"../models/SavedItems.js":7}],19:[function(require,module,exports){
var template = require('../../../templates/secondQuestion.hbs');

module.exports = Backbone.View.extend({

	initialize: function() {},

	events: {
		'click #ingredient' : 'getIngredient'
	},

	setTag: function(tag) {
		this.tag = tag;
	},

	getIngredient: function(e) {
		var ingredient = $(e.currentTarget).attr('class');
		this.$el.detach();
		Backbone.history.navigate( 'results/'+ this.tag +'/'+ ingredient, {trigger:true} );
	},

	render: function() {
		var index = template(this.model.toJSON());
		this.$el.html(index);
		this.delegateEvents();
		return this;
	}

});

},{"../../../templates/secondQuestion.hbs":27}],20:[function(require,module,exports){
var template = require('../../../templates/signup.hbs');
var SignUp = require('../models/SignUp.js');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

    events: {
		'click #createAccount' : 'showSignupPage',
    'click #signup' : 'signup'
    },

    signup: function(e) {
      e.preventDefault();
      var thiz = this;
      var email =  $(this.el).find('#emailInput').val();
      var password =  $(this.el).find('#passwordInput').val();
      var signUp = new SignUp({
        localEmail:email,
        localPassword:password
      });

      signUp.save([],{
        dataType: 'text',
        success: function(model, response){
          if(response === 'This user already exists'){
            thiz.$(e.currentTarget).html('User already exists');
          }
          else{
            Backbone.history.navigate('/', {trigger:true});
          }
        }
      });

    },


    render: function() {
      var signupHtml = template("");
      this.$el.html(signupHtml);
      return this;
    }
});
},{"../../../templates/signup.hbs":28,"../models/SignUp.js":9}],21:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<div class=\"large-8 medium-8 small-10 large-centered medium-centered small-centered columns text-center\">\n    <button id=\"tag\" class=";
  if (helper = helpers.tag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n</div>\n";
  return buffer;
  }

  buffer += "<div class=\"row\">\n    <div class=\"question full large-8 medium-8 small-10 large-centered medium-centered small-centered columns text-center\">";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n</div>\n\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.choices), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  return buffer;
  });

},{"hbsfy/runtime":36}],22:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"off-canvas-wrap\">\n  <div class=\"inner-wrap\">\n    <nav class=\"tab-bar\">\n      <section class=\"left-small\">\n        <a class=\"left-off-canvas-toggle menu-icon\">\n          <span></span>\n        </a>\n      </section>\n      <section class=\"middle tab-bar-section\">\n        <a href=\"/\"><img id=\"logo\" src=\"../assets/images/toastie.png\"/></a>\n      </section>\n    </nav>\n    <aside class=\"left-off-canvas-menu\">\n      <ul class=\"off-canvas-list\">\n        <li><a href=\"#login\">Log in</a></li>\n        <li><a href=\"#\">Log out</a></li>\n        <li><a href=\"#myAccount\">My Account</a></li>\n        <li><a href=\"#savedItems\">Saved Items</a></li>\n      </ul>\n    </aside>\n    <i class=\"fa-menu\"></i>\n\n    <a class=\"exit-off-canvas\"></a>\n\n  <div class=Question></div>\n  <div class=Result></div>\n\n  </div>\n</div>\n";
  });

},{"hbsfy/runtime":36}],23:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"loginForm small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n    <form class=\"loginForm\" action=\"/login\" method=\"post\">\n        <input id=\"emailInput\" name=\"email\" type=\"text\" placeholder=\"email\">\n        <input id=\"passwordInput\" name=\"password\" type=\"text\" placeholder=\"passwords\">\n        <a class=\"sub-line\" href=\"\">Forgot your password?</a>\n        <button id=\"login\" type=\"submit\">Sign-in</button>\n        <div class=\"DividerDiv small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n            <span class=\"divider\"></span>\n            <span class=\"dividerWord\">or</span>\n            <span class=\"divider\"></span>\n        </div>\n    </form>\n    <div id=\"createAccount\" class=\"small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n        <a href=\"#signup\">Create an Account</a>\n    </div>\n    <h1 id=\"badCredentials\"></h1>\n</div>\n";
  });

},{"hbsfy/runtime":36}],24:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"loginForm small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n    <h1>\n      Account Info\n    </h1>\n    <form  method=\"post\">\n        <input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"Name\">\n        <input type=\"text\" class=\"form-control\" name=\"email\" placeholder=\"email\">\n        <input type=\"password\" class=\"form-control\" name=\"password\" placeholder=\"password\">\n        <button>Edit</button>\n    </form>\n</div>";
  });

},{"hbsfy/runtime":36}],25:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"cocktailRecipeItem large-8 medium-8 small-12 large-centered medium-centered small-centered columns\">\n    <ul>\n        <li class=\"cocktailImage\">";
  if (helper = helpers.img) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.img); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li class=\"cocktailTitle\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li class=\"cocktailDescription\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li class=\"cocktailServing\">makes ";
  if (helper = helpers.servings) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.servings); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " servings</li>\n        <li><span class=\"titleRecipe\">Ingredients: </span>";
  if (helper = helpers.ingredients) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ingredients); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li><span class=\"titleRecipe\">Recipe:</span> ";
  if (helper = helpers.directions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.directions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n    </ul>\n   <div class=\"large-8 medium-8 small-10 large-centered medium-centered small-centered columns\"> <button class=\"recipeButton\">Save Item</button><button class=\"recipeButton\">Share!</button></div>\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":36}],26:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <h2>";
  if (helper = helpers.drink) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.drink); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n    ";
  return buffer;
  }

  buffer += "<div class=\"cocktailRecipeItem large-8 medium-8 small-12 large-centered medium-centered small-centered columns\">\n\n<div id=\"savedItems\">\n    <h1>Saved Items</h1>\n    ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n</div>\n";
  return buffer;
  });

},{"hbsfy/runtime":36}],27:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<div class=\"large-8 medium-8 small-10 large-centered medium-centered small-centered columns text-center\">\n    <button id=\"ingredient\" class=";
  if (helper = helpers.ingredient) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ingredient); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n</div>\n";
  return buffer;
  }

  buffer += "<div class=\"row\">\n    <div class=\"question full large-8 medium-8 small-10 large-centered medium-centered small-centered columns text-center\">";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n</div>\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.choices), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n\n\n\n\n";
  return buffer;
  });

},{"hbsfy/runtime":36}],28:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"loginForm small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n    <h1>\n        Create Account\n    </h1>\n    <form action=\"/signup\" method=\"post\">\n        <input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"Name\">\n        <input type=\"text\" class=\"form-control\" name=\"email\" placeholder=\"email\">\n        <input type=\"password\" class=\"form-control\" name=\"password\" placeholder=\"password\">\n        <input type=\"password\" class=\"form-control\" name=\"password\" placeholder=\"confirm pasword\">\n        <button>Create Account</button>\n    </form>\n    <button>Cancel</button>\n</div>\n";
  });

},{"hbsfy/runtime":36}],29:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":30,"./handlebars/exception":31,"./handlebars/runtime":32,"./handlebars/safe-string":33,"./handlebars/utils":34}],30:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":31,"./utils":34}],31:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],32:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":30,"./exception":31,"./utils":34}],33:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],34:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":33}],35:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":29}],36:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":35}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL21haW4uanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvbW9kZWxzL0NoZWNrU2Vzc2lvbi5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvRHJpbmsuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvbW9kZWxzL0RyaW5rQ29sbGVjdGlvbnMuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvbW9kZWxzL0ZpcnN0UXVlc3Rpb24uanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvbW9kZWxzL1NhdmVEcmluay5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvU2F2ZWRJdGVtcy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvU2Vjb25kUXVlc3Rpb24uanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvbW9kZWxzL1NpZ25VcC5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvVXNlci5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9yb3V0ZXJzL1JvdXRlcy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9BY2NvdW50Vmlldy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9Ecmlua0NvbGxlY3Rpb25zVmlldy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9Ecmlua1ZpZXcuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvdmlld3MvRmlyc3RRdWVzdGlvblZpZXcuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvdmlld3MvSW5kZXhWaWV3LmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL3ZpZXdzL0xvZ2luVmlldy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9TYXZlZEl0ZW1zVmlldy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9TZWNvbmRRdWVzdGlvblZpZXcuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvdmlld3Mvc2lnbnVwVmlldy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC90ZW1wbGF0ZXMvZmlyc3RRdWVzdGlvbi5oYnMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvdGVtcGxhdGVzL2luZGV4LmhicyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC90ZW1wbGF0ZXMvbG9naW4uaGJzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL3RlbXBsYXRlcy9teUFjY291bnQuaGJzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL3RlbXBsYXRlcy9yZXN1bHRzVmlldy5oYnMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvdGVtcGxhdGVzL3NhdmVkSXRlbXMuaGJzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL3RlbXBsYXRlcy9zZWNvbmRRdWVzdGlvbi5oYnMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvdGVtcGxhdGVzL3NpZ251cC5oYnMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL25vZGVfbW9kdWxlcy9oYnNmeS9ydW50aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJvdXRlcyA9IHJlcXVpcmUoJy4vcm91dGVycy9Sb3V0ZXMuanMnKTtcblxuJChmdW5jdGlvbigpIHtcblx0dmFyIHJvdXRlcyA9IG5ldyBSb3V0ZXMoKTtcblx0QmFja2JvbmUuaGlzdG9yeS5zdGFydCgpO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvY2hlY2tTZXNzaW9uL1wiLFxuXHRkZWZhdWx0czoge1xuICAgIGxvY2FsRW1haWw6IFwiXCJcblx0fVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cdGRlZmF1bHRzOiB7XG4gICAgbmFtZTogXCJcIixcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbmdyZWRpZW50czogXCJcIixcblx0XHRkaXJlY3Rpb25zOiBcIlwiLFxuXHRcdHRhZzogXCJcIixcblx0XHRzZXJ2aW5nczogXCJcIixcblx0XHRpbWc6IFwiXCJcblx0fVxufSk7XG4iLCJ2YXIgRHJpbmsgPSByZXF1aXJlKCcuL0RyaW5rLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuXHRcdHRoaXMuaW5ncmVkaWVudCA9IG9wdGlvbnMuaW5ncmVkaWVudDtcblx0XHR0aGlzLnRhZyA9IG9wdGlvbnMudGFnO1xuXHRcdHRoaXMudXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdjEvZ2V0RHJpbmsvJyt0aGlzLnRhZysnLycrdGhpcy5pbmdyZWRpZW50O1xuXHR9LFxuXG5cdG1vZGVsOiBEcmlua1xuXG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0dXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdjEvZ2V0Rmlyc3RRdWVzdGlvbi9cIixcblx0ZGVmYXVsdHM6IHtcblx0XHRcInF1ZXN0aW9uXCIgOiBcIlwiLFxuXHRcdFwiY2hvaWNlc1wiIDogW1xuXHRcdFx0e1xuXHRcdFx0XHRcImxhYmVsXCIgOiBcIlwiLFxuXHRcdFx0XHRcInRhZ1wiIDogXCJcIlxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJsYWJlbFwiIDogXCJcIixcblx0XHRcdFx0XCJ0YWdcIiA6IFwiXCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwibGFiZWxcIiA6IFwiXCIsXG5cdFx0XHRcdFwidGFnXCIgOiBcIlwiXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcInJhbmRvbVwiIDogXCJcIlxuXHR9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9zYXZlRHJpbmsvXCIsXG5cdGRlZmF1bHRzOiB7XG4gICAgbG9jYWxFbWFpbDogXCJcIixcbiAgICBkcmluazogXCJcIlxuXHR9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9nZXRTYXZlZEl0ZW1zL1wiLFxuXHRkZWZhdWx0czoge1xuICAgIGxvY2FsRW1haWw6ICcnLFxuICAgIHNhdmVkRHJpbmtzOiBbXVxuXHR9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0dXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdjEvZ2V0U2Vjb25kUXVlc3Rpb24vXCIsXG5cdGRlZmF1bHRzOiB7XG5cdFx0XCJxdWVzdGlvblwiIDogXCJcIixcblx0XHRcImNob2ljZXNcIiA6IFtcblx0XHRcdHtcblx0XHRcdFx0XCJsYWJlbFwiIDogXCJcIixcblx0XHRcdFx0XCJ0YWdcIiA6IFwiXCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwibGFiZWxcIiA6IFwiXCIsXG5cdFx0XHRcdFwidGFnXCIgOiBcIlwiXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImxhYmVsXCIgOiBcIlwiLFxuXHRcdFx0XHRcInRhZ1wiIDogXCJcIlxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0XCJyYW5kb21cIiA6IFwiXCJcblx0fVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvc2lnbnVwL1wiLFxuICBkZWZhdWx0czoge1xuICAgIGxvY2FsRW1haWwgICAgICAgOiAnJyxcbiAgICBsb2NhbFBhc3N3b3JkICAgIDogJydcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvbG9naW4vXCIsXG4gIGRlZmF1bHRzOiB7XG4gICAgbG9jYWxFbWFpbCAgICAgICA6ICcnLFxuICAgIGxvY2FsUGFzc3dvcmQgICAgOiAnJyxcbiAgICB0d2l0dGVySWQgICAgICAgICAgOiAnJyxcbiAgICB0d2l0dGVyVG9rZW4gICAgICAgOiAnJyxcbiAgICB0d2l0dGVyRGlzcGxheU5hbWUgOiAnJyxcbiAgICB0d2l0dGVyVXNlck5hbWUgICAgOiAnJyxcbiAgICBzYXZlZERyaW5rcyAgICAgICAgOiBbXVxuICB9XG59KTtcbiIsInZhciBEcmluayA9IHJlcXVpcmUoJy4uL21vZGVscy9Ecmluay5qcycpO1xudmFyIERyaW5rQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9Ecmlua0NvbGxlY3Rpb25zLmpzJyk7XG52YXIgRHJpbmtDb2xsZWN0aW9uc1ZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9Ecmlua0NvbGxlY3Rpb25zVmlldy5qcycpO1xudmFyIEZpcnN0UXVlc3Rpb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvRmlyc3RRdWVzdGlvbi5qcycpO1xudmFyIFNlY29uZFF1ZXN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL1NlY29uZFF1ZXN0aW9uLmpzJyk7XG52YXIgRmlyc3RRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9GaXJzdFF1ZXN0aW9uVmlldy5qcycpO1xudmFyIFNlY29uZFF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL1NlY29uZFF1ZXN0aW9uVmlldy5qcycpO1xudmFyIEluZGV4VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL0luZGV4Vmlldy5qcycpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvVXNlci5qcycpO1xudmFyIExvZ2luVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL0xvZ2luVmlldy5qcycpO1xudmFyIFNhdmVkSXRlbXNWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvU2F2ZWRJdGVtc1ZpZXcuanMnKTtcbnZhciBDaGVja1Nlc3Npb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvQ2hlY2tTZXNzaW9uLmpzJyk7XG52YXIgU2lnbnVwVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3NpZ251cFZpZXcuanMnKTtcbnZhciBBY2NvdW50VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL0FjY291bnRWaWV3LmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cblxuICAgIHJvdXRlczoge1xuICAgICAgICBcIm15QWNjb3VudFwiOlwic2hvd015QWNjb3VudFBhZ2VcIixcbiAgICAgICAgXCJzYXZlZEl0ZW1zXCI6IFwic2hvd1NhdmVkSXRlbXNcIixcbiAgICAgICAgXCJzaWdudXBcIjpcInNob3dTaWdudXBQYWdlXCIsXG4gICAgICAgIFwibG9naW5cIjogXCJzaG93TG9naW5QYWdlXCIsXG4gICAgICAgIFwiXCI6IFwic2hvd0ZpcnN0UXVlc3Rpb25cIixcbiAgICAgICAgXCI6dGFnXCI6ICdzaG93U2Vjb25kUXVlc3Rpb24nLFxuICAgICAgICBcInJlc3VsdHMvOnRhZy86aW5ncmVkaWVudFwiOiBcImdldFJlc3VsdHNcIixcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coJ2luaXRpYWxpemVkJyk7XG4gICAgICB2YXIgdGhpeiA9IHRoaXM7XG5cbiAgICAgIHRoaXMubG9naW4gPSBuZXcgVXNlcigpO1xuICAgICAgdmFyIGNoZWNrU2Vzc2lvbiA9IG5ldyBDaGVja1Nlc3Npb24oKTtcbiAgICAgICAgY2hlY2tTZXNzaW9uLmZldGNoKHtcbiAgICAgICAgICBkYXRhVHlwZTondGV4dCcsXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24obW9kZWwsIHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRoaXoubG9naW4uc2V0KHtsb2NhbEVtYWlsOnJlc3BvbnNlfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgaW5kZXhWaWV3ID0gbmV3IEluZGV4Vmlldyh7XG4gICAgICAgICAgICBtb2RlbDoge31cbiAgICAgICAgfSk7XG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhWaWV3LmVsKTtcbiAgICAgICAgdGhpcy5maXJzdFF1ZXN0aW9uID0gbmV3IEZpcnN0UXVlc3Rpb24oKTtcbiAgICAgICAgdGhpcy5maXJzdFF1ZXN0aW9uVmlldyA9IG5ldyBGaXJzdFF1ZXN0aW9uVmlldyh7XG4gICAgICAgICAgICBtb2RlbDogdGhpcy5maXJzdFF1ZXN0aW9uXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuZmlyc3RRdWVzdGlvbi5mZXRjaCh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5maXJzdFF1ZXN0aW9uVmlldy5yZW5kZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2Vjb25kUXVlc3Rpb24gPSBuZXcgU2Vjb25kUXVlc3Rpb24oKTtcbiAgICAgICAgdGhpcy5zZWNvbmRRdWVzdGlvbi5mZXRjaCgpO1xuICAgIH0sXG5cbiAgICBzaG93U2F2ZWRJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2F2ZWRJdGVtc1ZpZXcgPSBuZXcgU2F2ZWRJdGVtc1ZpZXcoKTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubG9naW4pO1xuICAgICAgaWYgKHRoaXMubG9naW4ubG9jYWxFbWFpbCAhPT0gJycgKXtcbiAgICAgICAgc2F2ZWRJdGVtc1ZpZXcuc2V0TG9naW4odGhpcy5sb2dpbi5nZXQoJ2xvY2FsRW1haWwnKSk7XG4gICAgICAgIHNhdmVkSXRlbXNWaWV3LmZldGNoKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnL2xvZ2luJywge3RyaWdnZXI6dHJ1ZX0pXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgICQoJy5RdWVzdGlvbicpLmVtcHR5KCk7XG4gICAgICAkKCcuUmVzdWx0JykuZW1wdHkoKTtcbiAgICAgICQoJy5SZXN1bHQnKS5hcHBlbmQoc2F2ZWRJdGVtc1ZpZXcuZWwpO1xuICAgIH0sXG5cbiAgICBzaG93TG9naW5QYWdlOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgdGhpcy5sb2dpbiA9IG5ldyBVc2VyKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLmxvZ2luJywgdGhpcy5sb2dpbik7XG4gICAgICAgIHZhciBsb2dpblZpZXcgPSBuZXcgTG9naW5WaWV3KHttb2RlbDp0aGlzLmxvZ2lufSk7XG4gICAgICAgICQoJy5RdWVzdGlvbicpLmVtcHR5KCk7XG4gICAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgICAkKCcuUmVzdWx0JykuYXBwZW5kKGxvZ2luVmlldy5lbCk7XG4gICAgfSxcbiAgICBzaG93U2lnbnVwUGFnZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2lnbnVwVmlldyA9IG5ldyBTaWdudXBWaWV3KCk7XG4gICAgICAgICQoJy5RdWVzdGlvbicpLmVtcHR5KCk7XG4gICAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgICAkKCcuUmVzdWx0JykuYXBwZW5kKHNpZ251cFZpZXcuZWwpO1xuICAgIH0sXG4gICAgc2hvd015QWNjb3VudFBhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjY291bnRWaWV3ID0gbmV3IEFjY291bnRWaWV3KCk7XG4gICAgICAgICQoJy5RdWVzdGlvbicpLmVtcHR5KCk7XG4gICAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgICAkKCcuUmVzdWx0JykuYXBwZW5kKGFjY291bnRWaWV3LmVsKTtcbiAgICB9LFxuXG4gICAgc2hvd0ZpcnN0UXVlc3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgICAkKCcuUXVlc3Rpb24nKS5odG1sKHRoaXMuZmlyc3RRdWVzdGlvblZpZXcuZWwpO1xuICAgIH0sXG5cbiAgICBzaG93U2Vjb25kUXVlc3Rpb246IGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgdGhpcy5zZWNvbmRRdWVzdGlvblZpZXcgPSBuZXcgU2Vjb25kUXVlc3Rpb25WaWV3KHtcbiAgICAgICAgICAgIG1vZGVsOiB0aGlzLnNlY29uZFF1ZXN0aW9uXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNlY29uZFF1ZXN0aW9uVmlldy5yZW5kZXIoKTtcbiAgICAgICAgdGhpcy5zZWNvbmRRdWVzdGlvblZpZXcuc2V0VGFnKHRhZyk7XG4gICAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgICAkKCcuUXVlc3Rpb24nKS5odG1sKHRoaXMuc2Vjb25kUXVlc3Rpb25WaWV3LmVsKTtcbiAgICB9LFxuXG4gICAgZ2V0UmVzdWx0czogZnVuY3Rpb24gKHRhZywgaW5ncmVkaWVudCkge1xuICAgICAgY29uc29sZS5sb2coJ3RoaXMubG9naW4nLCB0aGlzLmxvZ2luKTtcbiAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIHJlbmRlckRyaW5rQ29sbGVjdGlvbigpIHtcbiAgICAgICAgdmFyIGRyaW5rQ29sbGVjdGlvbnNWaWV3ID0gbmV3IERyaW5rQ29sbGVjdGlvbnNWaWV3KHtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBkcmlua0NvbGxlY3Rpb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhpcyBoYXMgYmVlbiBzZXRcbiAgICAgICAgICAgIGlmICh0aGl6LmxvZ2luICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICBkcmlua0NvbGxlY3Rpb25zVmlldy5zZXRMb2dpbih0aGl6LmxvZ2luLmdldCgnbG9jYWxFbWFpbCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRyaW5rQ29sbGVjdGlvbnNWaWV3LnJlbmRlcigpO1xuICAgICAgICAgICAgJCgnLlF1ZXN0aW9uJykuZW1wdHkoKTtcbiAgICAgICAgICAgICQoJy5SZXN1bHQnKS5odG1sKGRyaW5rQ29sbGVjdGlvbnNWaWV3LmVsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZHJpbmtDb2xsZWN0aW9uID0gbmV3IERyaW5rQ29sbGVjdGlvbihbXSwge1xuICAgICAgICAgICAgdGFnOiB0YWcsXG4gICAgICAgICAgICBpbmdyZWRpZW50OiBpbmdyZWRpZW50XG4gICAgICAgIH0pO1xuICAgICAgICBkcmlua0NvbGxlY3Rpb24uZmV0Y2goe1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyRHJpbmtDb2xsZWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcbiIsInZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3RlbXBsYXRlcy9teUFjY291bnQuaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9LFxuXG4gICAgZXZlbnRzOiB7XG5cdFx0J2NsaWNrICNteUFjY291bnQnIDogJ3Nob3dNeUFjY291bnRQYWdlJ1xuXHR9LCAgICBcbiAgICBcbiAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG15QWNjb3VudEh0bWwgPSB0ZW1wbGF0ZShcIlwiKTtcblx0XHR0aGlzLiRlbC5odG1sKG15QWNjb3VudEh0bWwpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59KTsiLCJ2YXIgRHJpbmtWaWV3ID0gcmVxdWlyZSgnLi9Ecmlua1ZpZXcuanMnKTtcbnZhciBTYXZlRHJpbmsgPSByZXF1aXJlKCcuLi9tb2RlbHMvU2F2ZURyaW5rLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHR0YWdOYW1lOiAnZGl2JyxcblxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgLnJlY2lwZUJ1dHRvbicgOiAnc2F2ZVJlY2lwZSdcbiAgfSxcblxuICBzZXRMb2dpbjogZnVuY3Rpb24obG9naW4pIHtcbiAgICBjb25zb2xlLmxvZygnbG9naW4nLCBsb2dpbik7XG4gICAgdGhpcy5lbWFpbCA9IGxvZ2luO1xuICB9LFxuXG4gIHNhdmVSZWNpcGU6IGZ1bmN0aW9uKGUpe1xuICAgIGlmICh0aGlzLmVtYWlsID09PSB1bmRlZmluZWQgfHwgdGhpcy5lbWFpbCA9PT0gJycpe1xuICAgICAgYWxlcnQoJ1lvdSBoYXZlIHRvIGxvZ2luIGZpcnN0IScpO1xuICAgICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnL2xvZ2luJywge3RyaWdnZXI6dHJ1ZX0pO1xuICAgIH1cbiAgICB2YXIgc2F2ZURyaW5rID0gbmV3IFNhdmVEcmluayh7XG4gICAgICBkcmluazogdGhpcy4kKGUuY3VycmVudFRhcmdldCkucGFyZW50KCkucHJldigpLmZpbmQoJy5jb2NrdGFpbFRpdGxlJykudGV4dCgpLFxuICAgICAgbG9jYWxFbWFpbDogdGhpcy5lbWFpbFxuICAgIH0pO1xuXG4gICAgc2F2ZURyaW5rLnNhdmUoW10sIHtcbiAgICAgIGRhdGFUeXBlOid0ZXh0JyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgIGlmIChyZXNwb25zZSA9PT0gXCJTYXZlZFwiKXtcblxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwb25zZSA9PT0gXCJEdXBsaWNhdGVcIil7XG4gICAgICAgICAgYWxlcnQoJ0RyaW5rIGFscmVhZHkgaW4geW91ciBsaXN0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGRyaW5rKXtcblx0XHRcdHZhciBkcmlua1ZpZXcgPSBuZXcgRHJpbmtWaWV3KHttb2RlbDpkcmlua30pO1xuXHRcdFx0dGhpcy4kZWwuYXBwZW5kKGRyaW5rVmlldy5lbCk7XG5cdFx0fSx0aGlzKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHR0YWdOYW1lOiAnZGl2Jyxcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yZW5kZXIoKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi90ZW1wbGF0ZXMvcmVzdWx0c1ZpZXcuaGJzJyk7XG5cdFx0dGhpcy4kZWwuaHRtbCh0ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0pO1xuIiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL2ZpcnN0UXVlc3Rpb24uaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdH0sXG5cblx0ZXZlbnRzOiB7XG5cdFx0J2NsaWNrICN0YWcnIDogJ2dldFRhZydcblx0fSxcblxuXHRnZXRUYWc6IGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgdGFnID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2NsYXNzJyk7XG5cdFx0dGhpcy4kZWwuZGV0YWNoKCk7XG5cdFx0QmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSggdGFnLCB7IHRyaWdnZXI6dHJ1ZSB9ICk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaW5kZXggPSB0ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKTtcblx0XHR0aGlzLiRlbC5odG1sKGluZGV4KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG59KTtcbiIsInZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3RlbXBsYXRlcy9pbmRleC5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdHRhZ05hbWU6ICdkaXYnLFxuXHRjbGFzc05hbWU6ICdwYWdlJyxcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yZW5kZXIoKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpbmRleCA9IHRlbXBsYXRlKFwiXCIpO1xuXHRcdHRoaXMuJGVsLmh0bWwoaW5kZXgpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pO1xuIiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL2xvZ2luLmhicycpO1xudmFyIFVzZXI9IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9nZ2VkSW4gPSBmYWxzZTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9LFxuXG5cdGV2ZW50czoge1xuXHRcdCdjbGljayAjbG9naW4nIDogJ2F0dGVtcHRMb2dpbidcblx0fSxcblxuXHRhdHRlbXB0TG9naW46IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB0aGl6ID0gdGhpc1xuICAgICAgdmFyIGVtYWlsID0gICQodGhpcy5lbCkuZmluZCgnI2VtYWlsSW5wdXQnKS52YWwoKTtcbiAgICAgIHZhciBwYXNzd29yZCA9ICAkKHRoaXMuZWwpLmZpbmQoJyNwYXNzd29yZElucHV0JykudmFsKCk7XG4gICAgICB2YXIgbG9naW4gPSBuZXcgVXNlcih7bG9jYWxFbWFpbDplbWFpbCwgbG9jYWxQYXNzd29yZDpwYXNzd29yZH0pO1xuICAgICAgdGhpcy5tb2RlbC5zZXQoe2xvY2FsRW1haWw6ZW1haWx9KTtcblxuICAgICAgbG9naW4uc2F2ZShbXSx7XG4gICAgICAgIGRhdGFUeXBlOlwidGV4dFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihtb2RlbCwgcmVzcG9uc2Upe1xuICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gXCJmYWlsXCIpe1xuICAgICAgICAgICAgdGhpei4kKCcjYmFkQ3JlZGVudGlhbHMnKS5odG1sKCd3cm9uZyBjcmVkZW50aWFscycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIEJhY2tib25lLmhpc3RvcnkubmF2aWdhdGUoJy8nLCB7dHJpZ2dlcjp0cnVlfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24obW9kZWwsIHJlc3BvbnNlKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhtb2RlbCwgcmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBsb2dpbkh0bWwgPSB0ZW1wbGF0ZShcIlwiKTtcblx0XHR0aGlzLiRlbC5odG1sKGxvZ2luSHRtbCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxufSk7IiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL3NhdmVkSXRlbXMuaGJzJyk7XG52YXIgU2F2ZWRJdGVtcyA9IHJlcXVpcmUoJy4uL21vZGVscy9TYXZlZEl0ZW1zLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgfSxcblxuICBzZXRMb2dpbjogZnVuY3Rpb24obG9naW4pe1xuICAgIHRoaXMuZW1haWwgPSBsb2dpbjtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmVtYWlsKTtcbiAgfSxcblxuICBmZXRjaDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRoaXogPSB0aGlzO1xuICAgIHZhciBzYXZlZEl0ZW1zID0gbmV3IFNhdmVkSXRlbXMoe2xvY2FsRW1haWw6dGhpcy5lbWFpbH0pO1xuICAgIGNvbnNvbGUubG9nKCdzYXZlZEl0ZW1zJywgc2F2ZWRJdGVtcyk7XG4gICAgLy91c2luZyBzYXZlIGhlcmUgLSBjb3VsZCBub3QgcGFzcyBwYXlsb2FkIHdpdGhcbiAgICAvL2ZldGNoL2dldCByZXF1ZXN0XG4gICAgc2F2ZWRJdGVtcy5zYXZlKG51bGwsIHtcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICB0aGl6LmRhdGFiYXNlUmV0dXJuID0gcmVzcG9uc2U7XG4gICAgICB0aGl6LnJlbmRlcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRoaXogPSB0aGlzO1xuXHRcdHZhciBzYXZlZEl0ZW1zSHRtbCA9IHRlbXBsYXRlKHRoaXouZGF0YWJhc2VSZXR1cm4pO1xuXHRcdHRoaXMuJGVsLmh0bWwoc2F2ZWRJdGVtc0h0bWwpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyIsInZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3RlbXBsYXRlcy9zZWNvbmRRdWVzdGlvbi5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7fSxcblxuXHRldmVudHM6IHtcblx0XHQnY2xpY2sgI2luZ3JlZGllbnQnIDogJ2dldEluZ3JlZGllbnQnXG5cdH0sXG5cblx0c2V0VGFnOiBmdW5jdGlvbih0YWcpIHtcblx0XHR0aGlzLnRhZyA9IHRhZztcblx0fSxcblxuXHRnZXRJbmdyZWRpZW50OiBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIGluZ3JlZGllbnQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignY2xhc3MnKTtcblx0XHR0aGlzLiRlbC5kZXRhY2goKTtcblx0XHRCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCAncmVzdWx0cy8nKyB0aGlzLnRhZyArJy8nKyBpbmdyZWRpZW50LCB7dHJpZ2dlcjp0cnVlfSApO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGluZGV4ID0gdGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSk7XG5cdFx0dGhpcy4kZWwuaHRtbChpbmRleCk7XG5cdFx0dGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pO1xuIiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL3NpZ251cC5oYnMnKTtcbnZhciBTaWduVXAgPSByZXF1aXJlKCcuLi9tb2RlbHMvU2lnblVwLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9LFxuXG4gICAgZXZlbnRzOiB7XG5cdFx0J2NsaWNrICNjcmVhdGVBY2NvdW50JyA6ICdzaG93U2lnbnVwUGFnZScsXG4gICAgJ2NsaWNrICNzaWdudXAnIDogJ3NpZ251cCdcbiAgICB9LFxuXG4gICAgc2lnbnVwOiBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICB2YXIgZW1haWwgPSAgJCh0aGlzLmVsKS5maW5kKCcjZW1haWxJbnB1dCcpLnZhbCgpO1xuICAgICAgdmFyIHBhc3N3b3JkID0gICQodGhpcy5lbCkuZmluZCgnI3Bhc3N3b3JkSW5wdXQnKS52YWwoKTtcbiAgICAgIHZhciBzaWduVXAgPSBuZXcgU2lnblVwKHtcbiAgICAgICAgbG9jYWxFbWFpbDplbWFpbCxcbiAgICAgICAgbG9jYWxQYXNzd29yZDpwYXNzd29yZFxuICAgICAgfSk7XG5cbiAgICAgIHNpZ25VcC5zYXZlKFtdLHtcbiAgICAgICAgZGF0YVR5cGU6ICd0ZXh0JyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24obW9kZWwsIHJlc3BvbnNlKXtcbiAgICAgICAgICBpZihyZXNwb25zZSA9PT0gJ1RoaXMgdXNlciBhbHJlYWR5IGV4aXN0cycpe1xuICAgICAgICAgICAgdGhpei4kKGUuY3VycmVudFRhcmdldCkuaHRtbCgnVXNlciBhbHJlYWR5IGV4aXN0cycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnLycsIHt0cmlnZ2VyOnRydWV9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSxcblxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzaWdudXBIdG1sID0gdGVtcGxhdGUoXCJcIik7XG4gICAgICB0aGlzLiRlbC5odG1sKHNpZ251cEh0bWwpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSk7IiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlcjtcbiAgYnVmZmVyICs9IFwiXFxuPGRpdiBjbGFzcz1cXFwibGFyZ2UtOCBtZWRpdW0tOCBzbWFsbC0xMCBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1ucyB0ZXh0LWNlbnRlclxcXCI+XFxuICAgIDxidXR0b24gaWQ9XFxcInRhZ1xcXCIgY2xhc3M9XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnRhZykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC50YWcpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5sYWJlbCkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5sYWJlbCk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2J1dHRvbj5cXG48L2Rpdj5cXG5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuXG4gIGJ1ZmZlciArPSBcIjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInF1ZXN0aW9uIGZ1bGwgbGFyZ2UtOCBtZWRpdW0tOCBzbWFsbC0xMCBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1ucyB0ZXh0LWNlbnRlclxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnF1ZXN0aW9uKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnF1ZXN0aW9uKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvZGl2PlxcbjwvZGl2PlxcblxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLmNob2ljZXMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW0oMSwgcHJvZ3JhbTEsIGRhdGEpLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuXFxuXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIFxuXG5cbiAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwib2ZmLWNhbnZhcy13cmFwXFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXBcXFwiPlxcbiAgICA8bmF2IGNsYXNzPVxcXCJ0YWItYmFyXFxcIj5cXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cXFwibGVmdC1zbWFsbFxcXCI+XFxuICAgICAgICA8YSBjbGFzcz1cXFwibGVmdC1vZmYtY2FudmFzLXRvZ2dsZSBtZW51LWljb25cXFwiPlxcbiAgICAgICAgICA8c3Bhbj48L3NwYW4+XFxuICAgICAgICA8L2E+XFxuICAgICAgPC9zZWN0aW9uPlxcbiAgICAgIDxzZWN0aW9uIGNsYXNzPVxcXCJtaWRkbGUgdGFiLWJhci1zZWN0aW9uXFxcIj5cXG4gICAgICAgIDxhIGhyZWY9XFxcIi9cXFwiPjxpbWcgaWQ9XFxcImxvZ29cXFwiIHNyYz1cXFwiLi4vYXNzZXRzL2ltYWdlcy90b2FzdGllLnBuZ1xcXCIvPjwvYT5cXG4gICAgICA8L3NlY3Rpb24+XFxuICAgIDwvbmF2PlxcbiAgICA8YXNpZGUgY2xhc3M9XFxcImxlZnQtb2ZmLWNhbnZhcy1tZW51XFxcIj5cXG4gICAgICA8dWwgY2xhc3M9XFxcIm9mZi1jYW52YXMtbGlzdFxcXCI+XFxuICAgICAgICA8bGk+PGEgaHJlZj1cXFwiI2xvZ2luXFxcIj5Mb2cgaW48L2E+PC9saT5cXG4gICAgICAgIDxsaT48YSBocmVmPVxcXCIjXFxcIj5Mb2cgb3V0PC9hPjwvbGk+XFxuICAgICAgICA8bGk+PGEgaHJlZj1cXFwiI215QWNjb3VudFxcXCI+TXkgQWNjb3VudDwvYT48L2xpPlxcbiAgICAgICAgPGxpPjxhIGhyZWY9XFxcIiNzYXZlZEl0ZW1zXFxcIj5TYXZlZCBJdGVtczwvYT48L2xpPlxcbiAgICAgIDwvdWw+XFxuICAgIDwvYXNpZGU+XFxuICAgIDxpIGNsYXNzPVxcXCJmYS1tZW51XFxcIj48L2k+XFxuXFxuICAgIDxhIGNsYXNzPVxcXCJleGl0LW9mZi1jYW52YXNcXFwiPjwvYT5cXG5cXG4gIDxkaXYgY2xhc3M9UXVlc3Rpb24+PC9kaXY+XFxuICA8ZGl2IGNsYXNzPVJlc3VsdD48L2Rpdj5cXG5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcblwiO1xuICB9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICBcblxuXG4gIHJldHVybiBcIjxkaXYgY2xhc3M9XFxcImxvZ2luRm9ybSBzbWFsbC0xMiBtZWRpdW0tOCBsYXJnZS04IHNtYWxsLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBsYXJnZS1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgPGZvcm0gY2xhc3M9XFxcImxvZ2luRm9ybVxcXCIgYWN0aW9uPVxcXCIvbG9naW5cXFwiIG1ldGhvZD1cXFwicG9zdFxcXCI+XFxuICAgICAgICA8aW5wdXQgaWQ9XFxcImVtYWlsSW5wdXRcXFwiIG5hbWU9XFxcImVtYWlsXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiZW1haWxcXFwiPlxcbiAgICAgICAgPGlucHV0IGlkPVxcXCJwYXNzd29yZElucHV0XFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcInBhc3N3b3Jkc1xcXCI+XFxuICAgICAgICA8YSBjbGFzcz1cXFwic3ViLWxpbmVcXFwiIGhyZWY9XFxcIlxcXCI+Rm9yZ290IHlvdXIgcGFzc3dvcmQ/PC9hPlxcbiAgICAgICAgPGJ1dHRvbiBpZD1cXFwibG9naW5cXFwiIHR5cGU9XFxcInN1Ym1pdFxcXCI+U2lnbi1pbjwvYnV0dG9uPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiRGl2aWRlckRpdiBzbWFsbC0xMiBtZWRpdW0tOCBsYXJnZS04IHNtYWxsLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBsYXJnZS1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiZGl2aWRlclxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJkaXZpZGVyV29yZFxcXCI+b3I8L3NwYW4+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImRpdmlkZXJcXFwiPjwvc3Bhbj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Zvcm0+XFxuICAgIDxkaXYgaWQ9XFxcImNyZWF0ZUFjY291bnRcXFwiIGNsYXNzPVxcXCJzbWFsbC0xMiBtZWRpdW0tOCBsYXJnZS04IHNtYWxsLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBsYXJnZS1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNzaWdudXBcXFwiPkNyZWF0ZSBhbiBBY2NvdW50PC9hPlxcbiAgICA8L2Rpdj5cXG4gICAgPGgxIGlkPVxcXCJiYWRDcmVkZW50aWFsc1xcXCI+PC9oMT5cXG48L2Rpdj5cXG5cIjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgXG5cblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJsb2dpbkZvcm0gc21hbGwtMTIgbWVkaXVtLTggbGFyZ2UtOCBzbWFsbC1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgbGFyZ2UtY2VudGVyZWQgY29sdW1uc1xcXCI+XFxuICAgIDxoMT5cXG4gICAgICBBY2NvdW50IEluZm9cXG4gICAgPC9oMT5cXG4gICAgPGZvcm0gIG1ldGhvZD1cXFwicG9zdFxcXCI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcGxhY2Vob2xkZXI9XFxcIk5hbWVcXFwiPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIG5hbWU9XFxcImVtYWlsXFxcIiBwbGFjZWhvbGRlcj1cXFwiZW1haWxcXFwiPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInBhc3N3b3JkXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgcGxhY2Vob2xkZXI9XFxcInBhc3N3b3JkXFxcIj5cXG4gICAgICAgIDxidXR0b24+RWRpdDwvYnV0dG9uPlxcbiAgICA8L2Zvcm0+XFxuPC9kaXY+XCI7XG4gIH0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cblxuICBidWZmZXIgKz0gXCI8ZGl2IGNsYXNzPVxcXCJjb2NrdGFpbFJlY2lwZUl0ZW0gbGFyZ2UtOCBtZWRpdW0tOCBzbWFsbC0xMiBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1uc1xcXCI+XFxuICAgIDx1bD5cXG4gICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxJbWFnZVxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmltZykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5pbWcpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxUaXRsZVxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLm5hbWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAubmFtZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICAgICAgPGxpIGNsYXNzPVxcXCJjb2NrdGFpbERlc2NyaXB0aW9uXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuZGVzY3JpcHRpb24pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxTZXJ2aW5nXFxcIj5tYWtlcyBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuc2VydmluZ3MpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuc2VydmluZ3MpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiIHNlcnZpbmdzPC9saT5cXG4gICAgICAgIDxsaT48c3BhbiBjbGFzcz1cXFwidGl0bGVSZWNpcGVcXFwiPkluZ3JlZGllbnRzOiA8L3NwYW4+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmluZ3JlZGllbnRzKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmluZ3JlZGllbnRzKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgICAgICA8bGk+PHNwYW4gY2xhc3M9XFxcInRpdGxlUmVjaXBlXFxcIj5SZWNpcGU6PC9zcGFuPiBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuZGlyZWN0aW9ucykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5kaXJlY3Rpb25zKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgIDwvdWw+XFxuICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtOCBtZWRpdW0tOCBzbWFsbC0xMCBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1uc1xcXCI+IDxidXR0b24gY2xhc3M9XFxcInJlY2lwZUJ1dHRvblxcXCI+U2F2ZSBJdGVtPC9idXR0b24+PGJ1dHRvbiBjbGFzcz1cXFwicmVjaXBlQnV0dG9uXFxcIj5TaGFyZSE8L2J1dHRvbj48L2Rpdj5cXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlcjtcbiAgYnVmZmVyICs9IFwiXFxuICAgICAgICA8aDI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmRyaW5rKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmRyaW5rKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvaDI+XFxuICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiY29ja3RhaWxSZWNpcGVJdGVtIGxhcmdlLTggbWVkaXVtLTggc21hbGwtMTIgbGFyZ2UtY2VudGVyZWQgbWVkaXVtLWNlbnRlcmVkIHNtYWxsLWNlbnRlcmVkIGNvbHVtbnNcXFwiPlxcblxcbjxkaXYgaWQ9XFxcInNhdmVkSXRlbXNcXFwiPlxcbiAgICA8aDE+U2F2ZWQgSXRlbXM8L2gxPlxcbiAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCBkZXB0aDAsIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbSgxLCBwcm9ncmFtMSwgZGF0YSksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG48L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgc2VsZj10aGlzO1xuXG5mdW5jdGlvbiBwcm9ncmFtMShkZXB0aDAsZGF0YSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyO1xuICBidWZmZXIgKz0gXCJcXG48ZGl2IGNsYXNzPVxcXCJsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEwIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zIHRleHQtY2VudGVyXFxcIj5cXG4gICAgPGJ1dHRvbiBpZD1cXFwiaW5ncmVkaWVudFxcXCIgY2xhc3M9XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmluZ3JlZGllbnQpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuaW5ncmVkaWVudCk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmxhYmVsKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmxhYmVsKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvYnV0dG9uPlxcbjwvZGl2PlxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwicXVlc3Rpb24gZnVsbCBsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEwIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zIHRleHQtY2VudGVyXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMucXVlc3Rpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAucXVlc3Rpb24pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAuY2hvaWNlcyksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbSgxLCBwcm9ncmFtMSwgZGF0YSksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG5cXG5cXG5cXG5cXG5cXG5cXG5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgXG5cblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJsb2dpbkZvcm0gc21hbGwtMTIgbWVkaXVtLTggbGFyZ2UtOCBzbWFsbC1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgbGFyZ2UtY2VudGVyZWQgY29sdW1uc1xcXCI+XFxuICAgIDxoMT5cXG4gICAgICAgIENyZWF0ZSBBY2NvdW50XFxuICAgIDwvaDE+XFxuICAgIDxmb3JtIGFjdGlvbj1cXFwiL3NpZ251cFxcXCIgbWV0aG9kPVxcXCJwb3N0XFxcIj5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiBwbGFjZWhvbGRlcj1cXFwiTmFtZVxcXCI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgbmFtZT1cXFwiZW1haWxcXFwiIHBsYWNlaG9sZGVyPVxcXCJlbWFpbFxcXCI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwicGFzc3dvcmRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIG5hbWU9XFxcInBhc3N3b3JkXFxcIiBwbGFjZWhvbGRlcj1cXFwicGFzc3dvcmRcXFwiPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInBhc3N3b3JkXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgcGxhY2Vob2xkZXI9XFxcImNvbmZpcm0gcGFzd29yZFxcXCI+XFxuICAgICAgICA8YnV0dG9uPkNyZWF0ZSBBY2NvdW50PC9idXR0b24+XFxuICAgIDwvZm9ybT5cXG4gICAgPGJ1dHRvbj5DYW5jZWw8L2J1dHRvbj5cXG48L2Rpdj5cXG5cIjtcbiAgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
