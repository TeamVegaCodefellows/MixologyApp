(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var formValidation = function(name, email, password, verifyPassword) {
  //Email Validation in JavaScript http://www.marketingtechblog.com/javascript-regex-emailaddress/#ixzz2y7xv1RHq
  console.log(arguments);
  function checkEmail(email){
    var pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    if(pattern.test(email)){
      return true;
    }else{
      $('#errors').html('Please provide a valid Email');
//      alert('Please provide a valid Email');
      return false;
    }
  }
  if(name===''|| email==='' || password===''|| verifyPassword===''){
    $('#errors').html('One of your fields have not been filled');
    return false;
  }
  if(password!==verifyPassword){
    $('#errors').html('Your passwords don\'t match');
    return false;
  }
  if(checkEmail(email)===false) return false;

  return true;
};

module.exports = formValidation;
},{}],2:[function(require,module,exports){
var Routes = require('./routers/Routes.js');

$(function() {
	var routes = new Routes();
	Backbone.history.start();
});

},{"./routers/Routes.js":14}],3:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/edit/",
	defaults: {
    verifyEmail: "",
    verifyPassword: "",
    newName: "",
    newEmail: "",
    newPassword: "",
	}
});

},{}],4:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/getName/",
	defaults: {
    name: ''
	}
});

},{}],5:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/checkSession/",
	defaults: {
    localEmail: ""
	}
});

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var Drink = require('./Drink.js');

module.exports = Backbone.Collection.extend({

	initialize: function(models, options) {
		this.ingredient = options.ingredient;
		this.tag = options.tag;
		this.url = '/api/v1/getDrink/'+this.tag+'/'+this.ingredient;
	},

	model: Drink

});

},{"./Drink.js":6}],8:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: "/api/v1/getFirstQuestion/",
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
  url: "/saveDrink/",
	defaults: {
    localEmail: "",
    drink: ""
	}
});

},{}],10:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/getSavedItems/",
	defaults: {
    localEmail: '',
    savedDrinks: []
	}
});

},{}],11:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: "/api/v1/getSecondQuestion/",
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

},{}],12:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/signup/",
  defaults: {
    localEmail       : '',
    localPassword    : ''
  }
});

},{}],13:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/login/",
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

},{}],14:[function(require,module,exports){
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
var Account = require('../models/Account.js');
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
      this.checkSession();
      var thiz = this;

      this.login = new User();
      this.checkSession();

      var indexView;
      indexView = new IndexView({
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

    checkSession: function() {
      var thiz = this;
      var checkSession = new CheckSession();
      checkSession.fetch({
        dataType:'text',
        success: function(model, response){
          thiz.login.set({localEmail:response});
          $('#loggedInName').html(thiz.login.get('localEmail'));
        }
      });
    },

    showSavedItems: function() {
      var savedItemsView = new SavedItemsView();

      if (this.login.get('localEmail') === ''){
        Backbone.history.navigate('/login', {trigger:true})
        return;
      }
      else{
        savedItemsView.setLogin(this.login.get('localEmail'));
        savedItemsView.fetch();
        $('.Question').empty();
        $('.Result').empty();
        $('.Result').append(savedItemsView.el);
      }

    },

    showLoginPage: function () {
      var loginView = new LoginView({model:this.login});
      $('.Question').empty();
      $('.Result').empty();
      $('.Result').append(loginView.el);
    },
    showSignupPage: function () {
      var signupView = new SignupView({model:this.login});
      $('.Question').empty();
      $('.Result').empty();
      $('.Result').append(signupView.el);
    },
    showMyAccountPage: function () {
      if (this.login.get('localEmail') === ''){
        Backbone.history.navigate('/login', {trigger:true})
        return;
      }
      else{
        var account = new Account();
        var accountView = new AccountView({model:account, login:this.login});
        $('.Question').empty();
        $('.Result').empty();
        $('.Result').append(accountView.el);
      }
    },

    showFirstQuestion: function () {
      console.log('hererere');
      this.checkSession();
      console.log('first Question: this.login', this.login);
      $('.Result').empty();
      this.firstQuestionView.render();
      $('.Question').html(this.firstQuestionView.el);
    },

    showSecondQuestion: function (tag) {
      this.checkSession();
      this.secondQuestionView = new SecondQuestionView({
        model: this.secondQuestion
      });
      this.secondQuestionView.render();
      this.secondQuestionView.setTag(tag);
      $('.Result').empty();
      $('.Question').html(this.secondQuestionView.el);
    },

    getResults: function (tag, ingredient) {
      this.checkSession();
      console.log('this.login', this.login);
      var thiz = this;
        function renderDrinkCollection() {
          var drinkCollectionsView = new DrinkCollectionsView({
            collection: drinkCollection
          });
            //check to see if this has been set

          console.log(thiz.login.get('localEmail'));
          if (thiz.login.get('localEmail') === ''){
            console.log('here');
//            drinkCollectionsView.setLogin(thiz.login.get('localEmail'));
            drinkCollectionsView.renderNotLoggedIn();
            $('.Question').empty();
            $('.Result').html(drinkCollectionsView.el);
          }
          else{
            console.log('another');
            drinkCollectionsView.setLogin(thiz.login.get('localEmail'));
            drinkCollectionsView.renderLoggedIn();
            $('.Question').empty();
            $('.Result').html(drinkCollectionsView.el);
          }
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

},{"../models/Account.js":3,"../models/CheckSession.js":5,"../models/Drink.js":6,"../models/DrinkCollections.js":7,"../models/FirstQuestion.js":8,"../models/SecondQuestion.js":11,"../models/User.js":13,"../views/AccountView.js":15,"../views/DrinkCollectionsView.js":16,"../views/FirstQuestionView.js":18,"../views/IndexView.js":19,"../views/LoginView.js":20,"../views/SavedItemsView.js":21,"../views/SecondQuestionView.js":22,"../views/signupView.js":23}],15:[function(require,module,exports){
var template = require('../../../templates/myAccount.hbs');
var formValidation = require('../../Util/formValidation.js');
var Account_userName = require('../models/Account_userName.js');

module.exports = Backbone.View.extend({
	initialize: function(options) {
    this.options = options || {};
    console.log(this.options.test);
		this.render();
	},

    events: {
		'click #editInfo' : 'editInfo'
	},    

  editInfo: function(e){
    e.preventDefault();
    var thiz = this;
    var verifyEmail = $(this.el).find('#verifyEmail').val();
    var verifyPassword = $(this.el).find('#verifyPassword').val();
    var newName = $(this.el).find('#newName').val();
    var newEmail = $(this.el).find('#newEmail').val();
    var newPassword = $(this.el).find('#newPassword').val();
    var newPasswordVerify = $(this.el).find('#newPasswordVerify').val();

    if (formValidation(newName,newEmail,newPassword,newPasswordVerify)===false){
      return;
    }

    this.model.set({
      verifyEmail: verifyEmail,
      verifyPassword: verifyPassword,
      newName: newName,
      newEmail: newEmail,
      newPassword: newPassword
    });

    this.model.save([], {
      dataType:'text',
      success: function(model, response){
        if (response === 'Update ok!'){
          alert('Account details changed!');
          thiz.options.login.set({localEmail:newEmail.toLowerCase()});
          $('#loggedInName').html(newEmail);
          Backbone.history.navigate('/', {trigger:true});
        }
        if(response === 'Wrong password!'){
          $('#errors').html('Wrong verification password provided!');
        }
        if(response === 'Wrong email!'){
          $('#errors').html('Wrong verification email provided!');
        }
        if(response === 'The new email you entered already exists!'){
          $('#errors').html('The new email you entered already exists!');
        }
      }
    })
  },

  fetchUserName: function() {
    var account_UserName = new Account_userName();
    account_UserName.fetch({
      success: function(){
        console.log(account_UserName);
        this.$('#userName').replaceWith(account_UserName.get('name'));
      }
    });
  },

  render: function() {
    var myAccountHtml = template("");
    this.$el.html(myAccountHtml);
    this.fetchUserName();
    return this;
  }
});
},{"../../../templates/myAccount.hbs":27,"../../Util/formValidation.js":1,"../models/Account_userName.js":4}],16:[function(require,module,exports){
var DrinkView = require('./DrinkView.js');
var SaveDrink = require('../models/SaveDrink.js');
var SavedItems = require('../models/SavedItems.js');

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
      Backbone.history.navigate('/login', {trigger:true});
    }
    var saveDrink = new SaveDrink({
      drink: this.$(e.currentTarget).parent().prev().find('.cocktailTitle').text(),
      localEmail: this.email
    });

    saveDrink.save([], {
      dataType:'text',
      success: function(model, response){
        if (response === "Saved!"){
          console.log(this.email);
          this.$(e.currentTarget).attr('disabled', true);
          this.$(e.currentTarget).html('Saved!');
        }
        if (response === "Duplicate"){
          alert('Drink already in your list');
        }
      }
    });
  },

	renderLoggedIn: function() {
    var thiz = this;
    var savedItems = new SavedItems();

    savedItems.set({localEmail:thiz.email});

    savedItems.save([], {
      success: function(model, response){
        console.log('length', thiz.collection.length);
        if (response.length !== 0){
          thiz.collection.each(function(drink){
            for (var each in response){
              console.log(response[each].name, drink.get('name'))
              if (response[each].name === drink.get('name')){
                var drinkView = new DrinkView({model:drink, match:true});
                break;
              }
              else{
                var drinkView = new DrinkView({model:drink, match:false});
              }
            }
            thiz.$el.append(drinkView.renderLoggedIn().el);
          },thiz);
        }
        else {
          thiz.renderNotLoggedIn();
        }
      }
    });
    return this;
	},

  renderNotLoggedIn: function() {
    this.collection.each(function(drink){
      var drinkView = new DrinkView({model:drink});
      this.$el.append(drinkView.renderNotLoggedIn().el);
    },this);
    return this;
  }

});
},{"../models/SaveDrink.js":9,"../models/SavedItems.js":10,"./DrinkView.js":17}],17:[function(require,module,exports){
module.exports = Backbone.View.extend({
	tagName: 'div',
	initialize: function(options) {
    this.options = options || {};
	},
	renderLoggedIn: function() {
    if (this.options.match === true){
      var template = require('../../../templates/resultsView_disabled.hbs');
      this.$el.html(template(this.model.toJSON()));
    }
    else{
      var template = require('../../../templates/resultsView.hbs');
      this.$el.html(template(this.model.toJSON()));
    }
		return this;
	},

  renderNotLoggedIn: function() {
    var template = require('../../../templates/resultsView.hbs');
    this.$el.html(template(this.model.toJSON()));
    return this;
  }

});
 
},{"../../../templates/resultsView.hbs":28,"../../../templates/resultsView_disabled.hbs":29}],18:[function(require,module,exports){
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
    this.delegateEvents();
		return this;
	}

});

},{"../../../templates/firstQuestion.hbs":24}],19:[function(require,module,exports){
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

},{"../../../templates/index.hbs":25}],20:[function(require,module,exports){
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
            $('#loggedInName').html(thiz.model.get('localEmail'));
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
},{"../../../templates/login.hbs":26,"../models/User.js":13}],21:[function(require,module,exports){
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
},{"../../../templates/savedItems.hbs":30,"../models/SavedItems.js":10}],22:[function(require,module,exports){
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

},{"../../../templates/secondQuestion.hbs":31}],23:[function(require,module,exports){
var template = require('../../../templates/signup.hbs');
var SignUp = require('../models/SignUp.js');
var formValidation = require('../../Util/formValidation.js');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

    events: {
      'click #signup' : 'signup',
      'click #Cancel' : 'cancel'
    },

    cancel: function(e){
      e.preventDefault();
      Backbone.history.navigate('/', {trigger:true});
    },

    signup: function(e) {
      e.preventDefault();
      var thiz = this;
      var name = $(this.el).find('#name').val();
      var email =  $(this.el).find('#emailInput').val();
      var password =  $(this.el).find('#passwordInput').val();
      var verifyPassword =  $(this.el).find('#verifyPassword').val();

      if (formValidation(name,email,password,verifyPassword)===false){
        return;
      }

      var signUp = new SignUp({
        name:name,
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
            thiz.model.set({localEmail:email});
            console.log('this.model', thiz.model);

            $('#loggedInName').html(thiz.model.get('localEmail'));
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
},{"../../../templates/signup.hbs":32,"../../Util/formValidation.js":1,"../models/SignUp.js":12}],24:[function(require,module,exports){
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

},{"hbsfy/runtime":40}],25:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"off-canvas-wrap\">\n  <div class=\"inner-wrap\">\n    <nav class=\"tab-bar\">\n      <section class=\"left-small\">\n        <a class=\"left-off-canvas-toggle menu-icon\">\n          <span></span>\n        </a>\n      </section>\n      <section class=\"middle tab-bar-section\">\n        <a href=\"/\"><img id=\"logo\" src=\"../assets/images/toastie.png\"/></a>\n      </section>\n        <section class=\"right\">\n            <h2 id=\"loggedInName\"></h2>\n        </section>\n    </nav>\n    <aside class=\"left-off-canvas-menu\">\n      <ul class=\"off-canvas-list\">\n        <li><a href=\"#login\">Log in</a></li>\n        <li><a href=\"/logout\">Log out</a></li>\n        <li><a href=\"#myAccount\">My Account</a></li>\n        <li><a href=\"#savedItems\">Saved Items</a></li>\n      </ul>\n    </aside>\n    <i class=\"fa-menu\"></i>\n\n    <a class=\"exit-off-canvas\"></a>\n\n  <div class=Question></div>\n  <div class=Result></div>\n\n  </div>\n</div>\n";
  });

},{"hbsfy/runtime":40}],26:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"loginForm small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n    <form class=\"loginForm\" action=\"/login\" method=\"post\">\n        <input id=\"emailInput\" name=\"email\" type=\"text\" placeholder=\"email\">\n        <input id=\"passwordInput\" name=\"password\" type=\"text\" placeholder=\"passwords\">\n        <a class=\"sub-line\" href=\"\">Forgot your password?</a>\n        <button id=\"login\" type=\"submit\">Sign-in</button>\n        <div class=\"DividerDiv small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n            <span class=\"divider\"></span>\n            <span class=\"dividerWord\">or</span>\n            <span class=\"divider\"></span>\n        </div>\n    </form>\n    <div id=\"createAccount\" class=\"small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n        <a href=\"#signup\">Create an Account</a>\n    </div>\n    <h1 id=\"badCredentials\"></h1>\n</div>\n";
  });

},{"hbsfy/runtime":40}],27:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"loginForm small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n    <h1>\n      Edit Account Info\n    </h1>\n    <h2 id=\"userName\"></h2>\n    <form  method=\"post\">\n        <h2>Verify Information</h2>\n        <input type=\"text\" class=\"form-control\" id=\"verifyEmail\" name=\"email\" placeholder=\"email\">\n        <input type=\"password\" class=\"form-control\" id=\"verifyPassword\" name=\"password\" placeholder=\"password\">\n\n        <h2>New details</h2>\n        <input type=\"text\" class=\"form-control\" id=\"newName\" name=\"name\" placeholder=\"Name\">\n        <input type=\"text\" class=\"form-control\" id=\"newEmail\" name=\"email\" placeholder=\"email\">\n        <input type=\"password\" class=\"form-control\" id=\"newPassword\" name=\"password\" placeholder=\"password\">\n        <input type=\"password\" class=\"form-control\" id=\"newPasswordVerify\" name=\"password\" placeholder=\"verify password\">\n        <button id=\"editInfo\">Edit</button>\n    </form>\n    <h1 id=\"errors\"></h1>\n</div>";
  });

},{"hbsfy/runtime":40}],28:[function(require,module,exports){
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
    + "</li>\n        <li class=\"cocktailServing\">Makes ";
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
    + "</li>\n    </ul>\n   <div class=\"large-8 medium-8 small-10 large-centered medium-centered small-centered columns\"> <button class=\"recipeButton\">Save Item</button><button class=\"recipeButton\">Share!</button></div>\n</div>\n";
  return buffer;
  });

},{"hbsfy/runtime":40}],29:[function(require,module,exports){
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
    + "</li>\n    </ul>\n   <div class=\"large-8 medium-8 small-10 large-centered medium-centered small-centered columns\"> <button class=\"recipeButton\" disabled>Already Saved</button><button class=\"recipeButton\">Share!</button></div>\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":40}],30:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <ul>\n            <li class=\"cocktailImage\">";
  if (helper = helpers.img) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.img); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n            <li class=\"cocktailTitle\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n            <li class=\"cocktailDescription\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n            <li class=\"cocktailServing\">makes ";
  if (helper = helpers.servings) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.servings); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " servings</li>\n            <li><span class=\"titleRecipe\">Ingredients: </span>";
  if (helper = helpers.ingredients) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ingredients); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n            <li><span class=\"titleRecipe\">Recipe:</span> ";
  if (helper = helpers.directions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.directions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        </ul>\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n        <h1>Nothing to display - add items</h1>\n    ";
  }

  buffer += "<div class=\"cocktailRecipeItem large-8 medium-8 small-12 large-centered medium-centered small-centered columns\">\n    ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":40}],31:[function(require,module,exports){
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

},{"hbsfy/runtime":40}],32:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"loginForm small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n    <h1>\n        Create Account\n    </h1>\n    <form action=\"#signup\">\n        <input type=\"text\" class=\"form-control\" id=\"name\" name=\"name\" placeholder=\"Name\">\n        <input type=\"text\" class=\"form-control\" id=\"emailInput\" name=\"email\" placeholder=\"email\">\n        <input type=\"password\" class=\"form-control\" id=\"passwordInput\" name=\"password\" placeholder=\"password\">\n        <input type=\"password\" class=\"form-control\" id=\"verifyPassword\" name=\"password\" placeholder=\"confirm pasword\">\n        <button id=\"signup\">Create Account</button>\n    </form>\n    <button id=\"Cancel\">Cancel</button>\n    <h1 id=\"errors\"></h1>\n</div>\n";
  });

},{"hbsfy/runtime":40}],33:[function(require,module,exports){
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
},{"./handlebars/base":34,"./handlebars/exception":35,"./handlebars/runtime":36,"./handlebars/safe-string":37,"./handlebars/utils":38}],34:[function(require,module,exports){
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
},{"./exception":35,"./utils":38}],35:[function(require,module,exports){
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
},{}],36:[function(require,module,exports){
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
},{"./base":34,"./exception":35,"./utils":38}],37:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],38:[function(require,module,exports){
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
},{"./safe-string":37}],39:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":33}],40:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":39}]},{},[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL1V0aWwvZm9ybVZhbGlkYXRpb24uanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvbWFpbi5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvQWNjb3VudC5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvQWNjb3VudF91c2VyTmFtZS5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvQ2hlY2tTZXNzaW9uLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL21vZGVscy9Ecmluay5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvRHJpbmtDb2xsZWN0aW9ucy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvRmlyc3RRdWVzdGlvbi5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvU2F2ZURyaW5rLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL21vZGVscy9TYXZlZEl0ZW1zLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL21vZGVscy9TZWNvbmRRdWVzdGlvbi5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvU2lnblVwLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL21vZGVscy9Vc2VyLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL3JvdXRlcnMvUm91dGVzLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL3ZpZXdzL0FjY291bnRWaWV3LmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL3ZpZXdzL0RyaW5rQ29sbGVjdGlvbnNWaWV3LmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL3ZpZXdzL0RyaW5rVmlldy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9GaXJzdFF1ZXN0aW9uVmlldy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9JbmRleFZpZXcuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvanMvYmFja2JvbmUvdmlld3MvTG9naW5WaWV3LmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL3ZpZXdzL1NhdmVkSXRlbXNWaWV3LmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL2pzL2JhY2tib25lL3ZpZXdzL1NlY29uZFF1ZXN0aW9uVmlldy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9zaWdudXBWaWV3LmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL3RlbXBsYXRlcy9maXJzdFF1ZXN0aW9uLmhicyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC90ZW1wbGF0ZXMvaW5kZXguaGJzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL3RlbXBsYXRlcy9sb2dpbi5oYnMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvdGVtcGxhdGVzL215QWNjb3VudC5oYnMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9hcHAvdGVtcGxhdGVzL3Jlc3VsdHNWaWV3LmhicyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC90ZW1wbGF0ZXMvcmVzdWx0c1ZpZXdfZGlzYWJsZWQuaGJzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL3RlbXBsYXRlcy9zYXZlZEl0ZW1zLmhicyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL2FwcC90ZW1wbGF0ZXMvc2Vjb25kUXVlc3Rpb24uaGJzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvYXBwL3RlbXBsYXRlcy9zaWdudXAuaGJzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9iYXNlLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9leGNlcHRpb24uanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwiL2hvbWUvaWFuL0Rlc2t0b3AvTWl4b2xvZ3lBcHAvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy91dGlscy5qcyIsIi9ob21lL2lhbi9EZXNrdG9wL01peG9sb2d5QXBwL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvaG9tZS9pYW4vRGVza3RvcC9NaXhvbG9neUFwcC9ub2RlX21vZHVsZXMvaGJzZnkvcnVudGltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGZvcm1WYWxpZGF0aW9uID0gZnVuY3Rpb24obmFtZSwgZW1haWwsIHBhc3N3b3JkLCB2ZXJpZnlQYXNzd29yZCkge1xuICAvL0VtYWlsIFZhbGlkYXRpb24gaW4gSmF2YVNjcmlwdCBodHRwOi8vd3d3Lm1hcmtldGluZ3RlY2hibG9nLmNvbS9qYXZhc2NyaXB0LXJlZ2V4LWVtYWlsYWRkcmVzcy8jaXh6ejJ5N3h2MVJIcVxuICBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICBmdW5jdGlvbiBjaGVja0VtYWlsKGVtYWlsKXtcbiAgICB2YXIgcGF0dGVybj0vXihbYS16QS1aMC05Xy4tXSkrQChbYS16QS1aMC05Xy4tXSkrXFwuKFthLXpBLVpdKSsoW2EtekEtWl0pKy87XG4gICAgaWYocGF0dGVybi50ZXN0KGVtYWlsKSl7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9ZWxzZXtcbiAgICAgICQoJyNlcnJvcnMnKS5odG1sKCdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIEVtYWlsJyk7XG4vLyAgICAgIGFsZXJ0KCdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIEVtYWlsJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmKG5hbWU9PT0nJ3x8IGVtYWlsPT09JycgfHwgcGFzc3dvcmQ9PT0nJ3x8IHZlcmlmeVBhc3N3b3JkPT09Jycpe1xuICAgICQoJyNlcnJvcnMnKS5odG1sKCdPbmUgb2YgeW91ciBmaWVsZHMgaGF2ZSBub3QgYmVlbiBmaWxsZWQnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYocGFzc3dvcmQhPT12ZXJpZnlQYXNzd29yZCl7XG4gICAgJCgnI2Vycm9ycycpLmh0bWwoJ1lvdXIgcGFzc3dvcmRzIGRvblxcJ3QgbWF0Y2gnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYoY2hlY2tFbWFpbChlbWFpbCk9PT1mYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtVmFsaWRhdGlvbjsiLCJ2YXIgUm91dGVzID0gcmVxdWlyZSgnLi9yb3V0ZXJzL1JvdXRlcy5qcycpO1xuXG4kKGZ1bmN0aW9uKCkge1xuXHR2YXIgcm91dGVzID0gbmV3IFJvdXRlcygpO1xuXHRCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgdXJsOiBcIi9lZGl0L1wiLFxuXHRkZWZhdWx0czoge1xuICAgIHZlcmlmeUVtYWlsOiBcIlwiLFxuICAgIHZlcmlmeVBhc3N3b3JkOiBcIlwiLFxuICAgIG5ld05hbWU6IFwiXCIsXG4gICAgbmV3RW1haWw6IFwiXCIsXG4gICAgbmV3UGFzc3dvcmQ6IFwiXCIsXG5cdH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICB1cmw6IFwiL2dldE5hbWUvXCIsXG5cdGRlZmF1bHRzOiB7XG4gICAgbmFtZTogJydcblx0fVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybDogXCIvY2hlY2tTZXNzaW9uL1wiLFxuXHRkZWZhdWx0czoge1xuICAgIGxvY2FsRW1haWw6IFwiXCJcblx0fVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cdGRlZmF1bHRzOiB7XG4gICAgbmFtZTogXCJcIixcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbmdyZWRpZW50czogXCJcIixcblx0XHRkaXJlY3Rpb25zOiBcIlwiLFxuXHRcdHRhZzogXCJcIixcblx0XHRzZXJ2aW5nczogXCJcIixcblx0XHRpbWc6IFwiXCJcblx0fVxufSk7XG4iLCJ2YXIgRHJpbmsgPSByZXF1aXJlKCcuL0RyaW5rLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuXHRcdHRoaXMuaW5ncmVkaWVudCA9IG9wdGlvbnMuaW5ncmVkaWVudDtcblx0XHR0aGlzLnRhZyA9IG9wdGlvbnMudGFnO1xuXHRcdHRoaXMudXJsID0gJy9hcGkvdjEvZ2V0RHJpbmsvJyt0aGlzLnRhZysnLycrdGhpcy5pbmdyZWRpZW50O1xuXHR9LFxuXG5cdG1vZGVsOiBEcmlua1xuXG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0dXJsOiBcIi9hcGkvdjEvZ2V0Rmlyc3RRdWVzdGlvbi9cIixcblx0ZGVmYXVsdHM6IHtcblx0XHRcInF1ZXN0aW9uXCIgOiBcIlwiLFxuXHRcdFwiY2hvaWNlc1wiIDogW1xuXHRcdFx0e1xuXHRcdFx0XHRcImxhYmVsXCIgOiBcIlwiLFxuXHRcdFx0XHRcInRhZ1wiIDogXCJcIlxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJsYWJlbFwiIDogXCJcIixcblx0XHRcdFx0XCJ0YWdcIiA6IFwiXCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwibGFiZWxcIiA6IFwiXCIsXG5cdFx0XHRcdFwidGFnXCIgOiBcIlwiXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcInJhbmRvbVwiIDogXCJcIlxuXHR9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgdXJsOiBcIi9zYXZlRHJpbmsvXCIsXG5cdGRlZmF1bHRzOiB7XG4gICAgbG9jYWxFbWFpbDogXCJcIixcbiAgICBkcmluazogXCJcIlxuXHR9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgdXJsOiBcIi9nZXRTYXZlZEl0ZW1zL1wiLFxuXHRkZWZhdWx0czoge1xuICAgIGxvY2FsRW1haWw6ICcnLFxuICAgIHNhdmVkRHJpbmtzOiBbXVxuXHR9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0dXJsOiBcIi9hcGkvdjEvZ2V0U2Vjb25kUXVlc3Rpb24vXCIsXG5cdGRlZmF1bHRzOiB7XG5cdFx0XCJxdWVzdGlvblwiIDogXCJcIixcblx0XHRcImNob2ljZXNcIiA6IFtcblx0XHRcdHtcblx0XHRcdFx0XCJsYWJlbFwiIDogXCJcIixcblx0XHRcdFx0XCJ0YWdcIiA6IFwiXCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwibGFiZWxcIiA6IFwiXCIsXG5cdFx0XHRcdFwidGFnXCIgOiBcIlwiXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImxhYmVsXCIgOiBcIlwiLFxuXHRcdFx0XHRcInRhZ1wiIDogXCJcIlxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0XCJyYW5kb21cIiA6IFwiXCJcblx0fVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybDogXCIvc2lnbnVwL1wiLFxuICBkZWZhdWx0czoge1xuICAgIGxvY2FsRW1haWwgICAgICAgOiAnJyxcbiAgICBsb2NhbFBhc3N3b3JkICAgIDogJydcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybDogXCIvbG9naW4vXCIsXG4gIGRlZmF1bHRzOiB7XG4gICAgbG9jYWxFbWFpbCAgICAgICA6ICcnLFxuICAgIGxvY2FsUGFzc3dvcmQgICAgOiAnJyxcbiAgICB0d2l0dGVySWQgICAgICAgICAgOiAnJyxcbiAgICB0d2l0dGVyVG9rZW4gICAgICAgOiAnJyxcbiAgICB0d2l0dGVyRGlzcGxheU5hbWUgOiAnJyxcbiAgICB0d2l0dGVyVXNlck5hbWUgICAgOiAnJyxcbiAgICBzYXZlZERyaW5rcyAgICAgICAgOiBbXVxuICB9XG59KTtcbiIsInZhciBEcmluayA9IHJlcXVpcmUoJy4uL21vZGVscy9Ecmluay5qcycpO1xudmFyIERyaW5rQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9Ecmlua0NvbGxlY3Rpb25zLmpzJyk7XG52YXIgRHJpbmtDb2xsZWN0aW9uc1ZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9Ecmlua0NvbGxlY3Rpb25zVmlldy5qcycpO1xudmFyIEZpcnN0UXVlc3Rpb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvRmlyc3RRdWVzdGlvbi5qcycpO1xudmFyIFNlY29uZFF1ZXN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL1NlY29uZFF1ZXN0aW9uLmpzJyk7XG52YXIgRmlyc3RRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9GaXJzdFF1ZXN0aW9uVmlldy5qcycpO1xudmFyIFNlY29uZFF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL1NlY29uZFF1ZXN0aW9uVmlldy5qcycpO1xudmFyIEluZGV4VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL0luZGV4Vmlldy5qcycpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvVXNlci5qcycpO1xudmFyIExvZ2luVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL0xvZ2luVmlldy5qcycpO1xudmFyIFNhdmVkSXRlbXNWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvU2F2ZWRJdGVtc1ZpZXcuanMnKTtcbnZhciBDaGVja1Nlc3Npb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvQ2hlY2tTZXNzaW9uLmpzJyk7XG52YXIgU2lnbnVwVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3NpZ251cFZpZXcuanMnKTtcbnZhciBBY2NvdW50ID0gcmVxdWlyZSgnLi4vbW9kZWxzL0FjY291bnQuanMnKTtcbnZhciBBY2NvdW50VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL0FjY291bnRWaWV3LmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cbiAgICByb3V0ZXM6IHtcbiAgICAgIFwibXlBY2NvdW50XCI6XCJzaG93TXlBY2NvdW50UGFnZVwiLFxuICAgICAgXCJzYXZlZEl0ZW1zXCI6IFwic2hvd1NhdmVkSXRlbXNcIixcbiAgICAgIFwic2lnbnVwXCI6XCJzaG93U2lnbnVwUGFnZVwiLFxuICAgICAgXCJsb2dpblwiOiBcInNob3dMb2dpblBhZ2VcIixcbiAgICAgIFwiXCI6IFwic2hvd0ZpcnN0UXVlc3Rpb25cIixcbiAgICAgIFwiOnRhZ1wiOiAnc2hvd1NlY29uZFF1ZXN0aW9uJyxcbiAgICAgIFwicmVzdWx0cy86dGFnLzppbmdyZWRpZW50XCI6IFwiZ2V0UmVzdWx0c1wiLFxuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZWQnKTtcbiAgICAgIHRoaXMuY2hlY2tTZXNzaW9uKCk7XG4gICAgICB2YXIgdGhpeiA9IHRoaXM7XG5cbiAgICAgIHRoaXMubG9naW4gPSBuZXcgVXNlcigpO1xuICAgICAgdGhpcy5jaGVja1Nlc3Npb24oKTtcblxuICAgICAgdmFyIGluZGV4VmlldztcbiAgICAgIGluZGV4VmlldyA9IG5ldyBJbmRleFZpZXcoe1xuICAgICAgICAgIG1vZGVsOiB7fVxuICAgICAgfSk7XG4gICAgICAkKCdib2R5JykuYXBwZW5kKGluZGV4Vmlldy5lbCk7XG4gICAgICB0aGlzLmZpcnN0UXVlc3Rpb24gPSBuZXcgRmlyc3RRdWVzdGlvbigpO1xuICAgICAgdGhpcy5maXJzdFF1ZXN0aW9uVmlldyA9IG5ldyBGaXJzdFF1ZXN0aW9uVmlldyh7XG4gICAgICAgICAgbW9kZWw6IHRoaXMuZmlyc3RRdWVzdGlvblxuICAgICAgfSk7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB0aGlzLmZpcnN0UXVlc3Rpb24uZmV0Y2goe1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhhdC5maXJzdFF1ZXN0aW9uVmlldy5yZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNlY29uZFF1ZXN0aW9uID0gbmV3IFNlY29uZFF1ZXN0aW9uKCk7XG4gICAgICB0aGlzLnNlY29uZFF1ZXN0aW9uLmZldGNoKCk7XG5cbiAgICB9LFxuXG4gICAgY2hlY2tTZXNzaW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgIHZhciBjaGVja1Nlc3Npb24gPSBuZXcgQ2hlY2tTZXNzaW9uKCk7XG4gICAgICBjaGVja1Nlc3Npb24uZmV0Y2goe1xuICAgICAgICBkYXRhVHlwZTondGV4dCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgICAgdGhpei5sb2dpbi5zZXQoe2xvY2FsRW1haWw6cmVzcG9uc2V9KTtcbiAgICAgICAgICAkKCcjbG9nZ2VkSW5OYW1lJykuaHRtbCh0aGl6LmxvZ2luLmdldCgnbG9jYWxFbWFpbCcpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNob3dTYXZlZEl0ZW1zOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzYXZlZEl0ZW1zVmlldyA9IG5ldyBTYXZlZEl0ZW1zVmlldygpO1xuXG4gICAgICBpZiAodGhpcy5sb2dpbi5nZXQoJ2xvY2FsRW1haWwnKSA9PT0gJycpe1xuICAgICAgICBCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCcvbG9naW4nLCB7dHJpZ2dlcjp0cnVlfSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgc2F2ZWRJdGVtc1ZpZXcuc2V0TG9naW4odGhpcy5sb2dpbi5nZXQoJ2xvY2FsRW1haWwnKSk7XG4gICAgICAgIHNhdmVkSXRlbXNWaWV3LmZldGNoKCk7XG4gICAgICAgICQoJy5RdWVzdGlvbicpLmVtcHR5KCk7XG4gICAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgICAkKCcuUmVzdWx0JykuYXBwZW5kKHNhdmVkSXRlbXNWaWV3LmVsKTtcbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICBzaG93TG9naW5QYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbG9naW5WaWV3ID0gbmV3IExvZ2luVmlldyh7bW9kZWw6dGhpcy5sb2dpbn0pO1xuICAgICAgJCgnLlF1ZXN0aW9uJykuZW1wdHkoKTtcbiAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgJCgnLlJlc3VsdCcpLmFwcGVuZChsb2dpblZpZXcuZWwpO1xuICAgIH0sXG4gICAgc2hvd1NpZ251cFBhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaWdudXBWaWV3ID0gbmV3IFNpZ251cFZpZXcoe21vZGVsOnRoaXMubG9naW59KTtcbiAgICAgICQoJy5RdWVzdGlvbicpLmVtcHR5KCk7XG4gICAgICAkKCcuUmVzdWx0JykuZW1wdHkoKTtcbiAgICAgICQoJy5SZXN1bHQnKS5hcHBlbmQoc2lnbnVwVmlldy5lbCk7XG4gICAgfSxcbiAgICBzaG93TXlBY2NvdW50UGFnZTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMubG9naW4uZ2V0KCdsb2NhbEVtYWlsJykgPT09ICcnKXtcbiAgICAgICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnL2xvZ2luJywge3RyaWdnZXI6dHJ1ZX0pXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIHZhciBhY2NvdW50ID0gbmV3IEFjY291bnQoKTtcbiAgICAgICAgdmFyIGFjY291bnRWaWV3ID0gbmV3IEFjY291bnRWaWV3KHttb2RlbDphY2NvdW50LCBsb2dpbjp0aGlzLmxvZ2lufSk7XG4gICAgICAgICQoJy5RdWVzdGlvbicpLmVtcHR5KCk7XG4gICAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgICAkKCcuUmVzdWx0JykuYXBwZW5kKGFjY291bnRWaWV3LmVsKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hvd0ZpcnN0UXVlc3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdoZXJlcmVyZScpO1xuICAgICAgdGhpcy5jaGVja1Nlc3Npb24oKTtcbiAgICAgIGNvbnNvbGUubG9nKCdmaXJzdCBRdWVzdGlvbjogdGhpcy5sb2dpbicsIHRoaXMubG9naW4pO1xuICAgICAgJCgnLlJlc3VsdCcpLmVtcHR5KCk7XG4gICAgICB0aGlzLmZpcnN0UXVlc3Rpb25WaWV3LnJlbmRlcigpO1xuICAgICAgJCgnLlF1ZXN0aW9uJykuaHRtbCh0aGlzLmZpcnN0UXVlc3Rpb25WaWV3LmVsKTtcbiAgICB9LFxuXG4gICAgc2hvd1NlY29uZFF1ZXN0aW9uOiBmdW5jdGlvbiAodGFnKSB7XG4gICAgICB0aGlzLmNoZWNrU2Vzc2lvbigpO1xuICAgICAgdGhpcy5zZWNvbmRRdWVzdGlvblZpZXcgPSBuZXcgU2Vjb25kUXVlc3Rpb25WaWV3KHtcbiAgICAgICAgbW9kZWw6IHRoaXMuc2Vjb25kUXVlc3Rpb25cbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWNvbmRRdWVzdGlvblZpZXcucmVuZGVyKCk7XG4gICAgICB0aGlzLnNlY29uZFF1ZXN0aW9uVmlldy5zZXRUYWcodGFnKTtcbiAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgJCgnLlF1ZXN0aW9uJykuaHRtbCh0aGlzLnNlY29uZFF1ZXN0aW9uVmlldy5lbCk7XG4gICAgfSxcblxuICAgIGdldFJlc3VsdHM6IGZ1bmN0aW9uICh0YWcsIGluZ3JlZGllbnQpIHtcbiAgICAgIHRoaXMuY2hlY2tTZXNzaW9uKCk7XG4gICAgICBjb25zb2xlLmxvZygndGhpcy5sb2dpbicsIHRoaXMubG9naW4pO1xuICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICBmdW5jdGlvbiByZW5kZXJEcmlua0NvbGxlY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGRyaW5rQ29sbGVjdGlvbnNWaWV3ID0gbmV3IERyaW5rQ29sbGVjdGlvbnNWaWV3KHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IGRyaW5rQ29sbGVjdGlvblxuICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhpcyBoYXMgYmVlbiBzZXRcblxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXoubG9naW4uZ2V0KCdsb2NhbEVtYWlsJykpO1xuICAgICAgICAgIGlmICh0aGl6LmxvZ2luLmdldCgnbG9jYWxFbWFpbCcpID09PSAnJyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGVyZScpO1xuLy8gICAgICAgICAgICBkcmlua0NvbGxlY3Rpb25zVmlldy5zZXRMb2dpbih0aGl6LmxvZ2luLmdldCgnbG9jYWxFbWFpbCcpKTtcbiAgICAgICAgICAgIGRyaW5rQ29sbGVjdGlvbnNWaWV3LnJlbmRlck5vdExvZ2dlZEluKCk7XG4gICAgICAgICAgICAkKCcuUXVlc3Rpb24nKS5lbXB0eSgpO1xuICAgICAgICAgICAgJCgnLlJlc3VsdCcpLmh0bWwoZHJpbmtDb2xsZWN0aW9uc1ZpZXcuZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Fub3RoZXInKTtcbiAgICAgICAgICAgIGRyaW5rQ29sbGVjdGlvbnNWaWV3LnNldExvZ2luKHRoaXoubG9naW4uZ2V0KCdsb2NhbEVtYWlsJykpO1xuICAgICAgICAgICAgZHJpbmtDb2xsZWN0aW9uc1ZpZXcucmVuZGVyTG9nZ2VkSW4oKTtcbiAgICAgICAgICAgICQoJy5RdWVzdGlvbicpLmVtcHR5KCk7XG4gICAgICAgICAgICAkKCcuUmVzdWx0JykuaHRtbChkcmlua0NvbGxlY3Rpb25zVmlldy5lbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBkcmlua0NvbGxlY3Rpb24gPSBuZXcgRHJpbmtDb2xsZWN0aW9uKFtdLCB7XG4gICAgICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgICAgIGluZ3JlZGllbnQ6IGluZ3JlZGllbnRcbiAgICAgICAgfSk7XG4gICAgICAgIGRyaW5rQ29sbGVjdGlvbi5mZXRjaCh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJEcmlua0NvbGxlY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbn0pO1xuIiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL215QWNjb3VudC5oYnMnKTtcbnZhciBmb3JtVmFsaWRhdGlvbiA9IHJlcXVpcmUoJy4uLy4uL1V0aWwvZm9ybVZhbGlkYXRpb24uanMnKTtcbnZhciBBY2NvdW50X3VzZXJOYW1lID0gcmVxdWlyZSgnLi4vbW9kZWxzL0FjY291bnRfdXNlck5hbWUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnNvbGUubG9nKHRoaXMub3B0aW9ucy50ZXN0KTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9LFxuXG4gICAgZXZlbnRzOiB7XG5cdFx0J2NsaWNrICNlZGl0SW5mbycgOiAnZWRpdEluZm8nXG5cdH0sICAgIFxuXG4gIGVkaXRJbmZvOiBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIHRoaXogPSB0aGlzO1xuICAgIHZhciB2ZXJpZnlFbWFpbCA9ICQodGhpcy5lbCkuZmluZCgnI3ZlcmlmeUVtYWlsJykudmFsKCk7XG4gICAgdmFyIHZlcmlmeVBhc3N3b3JkID0gJCh0aGlzLmVsKS5maW5kKCcjdmVyaWZ5UGFzc3dvcmQnKS52YWwoKTtcbiAgICB2YXIgbmV3TmFtZSA9ICQodGhpcy5lbCkuZmluZCgnI25ld05hbWUnKS52YWwoKTtcbiAgICB2YXIgbmV3RW1haWwgPSAkKHRoaXMuZWwpLmZpbmQoJyNuZXdFbWFpbCcpLnZhbCgpO1xuICAgIHZhciBuZXdQYXNzd29yZCA9ICQodGhpcy5lbCkuZmluZCgnI25ld1Bhc3N3b3JkJykudmFsKCk7XG4gICAgdmFyIG5ld1Bhc3N3b3JkVmVyaWZ5ID0gJCh0aGlzLmVsKS5maW5kKCcjbmV3UGFzc3dvcmRWZXJpZnknKS52YWwoKTtcblxuICAgIGlmIChmb3JtVmFsaWRhdGlvbihuZXdOYW1lLG5ld0VtYWlsLG5ld1Bhc3N3b3JkLG5ld1Bhc3N3b3JkVmVyaWZ5KT09PWZhbHNlKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICB2ZXJpZnlFbWFpbDogdmVyaWZ5RW1haWwsXG4gICAgICB2ZXJpZnlQYXNzd29yZDogdmVyaWZ5UGFzc3dvcmQsXG4gICAgICBuZXdOYW1lOiBuZXdOYW1lLFxuICAgICAgbmV3RW1haWw6IG5ld0VtYWlsLFxuICAgICAgbmV3UGFzc3dvcmQ6IG5ld1Bhc3N3b3JkXG4gICAgfSk7XG5cbiAgICB0aGlzLm1vZGVsLnNhdmUoW10sIHtcbiAgICAgIGRhdGFUeXBlOid0ZXh0JyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgIGlmIChyZXNwb25zZSA9PT0gJ1VwZGF0ZSBvayEnKXtcbiAgICAgICAgICBhbGVydCgnQWNjb3VudCBkZXRhaWxzIGNoYW5nZWQhJyk7XG4gICAgICAgICAgdGhpei5vcHRpb25zLmxvZ2luLnNldCh7bG9jYWxFbWFpbDpuZXdFbWFpbC50b0xvd2VyQ2FzZSgpfSk7XG4gICAgICAgICAgJCgnI2xvZ2dlZEluTmFtZScpLmh0bWwobmV3RW1haWwpO1xuICAgICAgICAgIEJhY2tib25lLmhpc3RvcnkubmF2aWdhdGUoJy8nLCB7dHJpZ2dlcjp0cnVlfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYocmVzcG9uc2UgPT09ICdXcm9uZyBwYXNzd29yZCEnKXtcbiAgICAgICAgICAkKCcjZXJyb3JzJykuaHRtbCgnV3JvbmcgdmVyaWZpY2F0aW9uIHBhc3N3b3JkIHByb3ZpZGVkIScpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHJlc3BvbnNlID09PSAnV3JvbmcgZW1haWwhJyl7XG4gICAgICAgICAgJCgnI2Vycm9ycycpLmh0bWwoJ1dyb25nIHZlcmlmaWNhdGlvbiBlbWFpbCBwcm92aWRlZCEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZihyZXNwb25zZSA9PT0gJ1RoZSBuZXcgZW1haWwgeW91IGVudGVyZWQgYWxyZWFkeSBleGlzdHMhJyl7XG4gICAgICAgICAgJCgnI2Vycm9ycycpLmh0bWwoJ1RoZSBuZXcgZW1haWwgeW91IGVudGVyZWQgYWxyZWFkeSBleGlzdHMhJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGZldGNoVXNlck5hbWU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50X1VzZXJOYW1lID0gbmV3IEFjY291bnRfdXNlck5hbWUoKTtcbiAgICBhY2NvdW50X1VzZXJOYW1lLmZldGNoKHtcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKGFjY291bnRfVXNlck5hbWUpO1xuICAgICAgICB0aGlzLiQoJyN1c2VyTmFtZScpLnJlcGxhY2VXaXRoKGFjY291bnRfVXNlck5hbWUuZ2V0KCduYW1lJykpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG15QWNjb3VudEh0bWwgPSB0ZW1wbGF0ZShcIlwiKTtcbiAgICB0aGlzLiRlbC5odG1sKG15QWNjb3VudEh0bWwpO1xuICAgIHRoaXMuZmV0Y2hVc2VyTmFtZSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTsiLCJ2YXIgRHJpbmtWaWV3ID0gcmVxdWlyZSgnLi9Ecmlua1ZpZXcuanMnKTtcbnZhciBTYXZlRHJpbmsgPSByZXF1aXJlKCcuLi9tb2RlbHMvU2F2ZURyaW5rLmpzJyk7XG52YXIgU2F2ZWRJdGVtcyA9IHJlcXVpcmUoJy4uL21vZGVscy9TYXZlZEl0ZW1zLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHR0YWdOYW1lOiAnZGl2JyxcblxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgLnJlY2lwZUJ1dHRvbicgOiAnc2F2ZVJlY2lwZSdcbiAgfSxcblxuICBzZXRMb2dpbjogZnVuY3Rpb24obG9naW4pIHtcbiAgICBjb25zb2xlLmxvZygnbG9naW4nLCBsb2dpbik7XG4gICAgdGhpcy5lbWFpbCA9IGxvZ2luO1xuICB9LFxuXG4gIHNhdmVSZWNpcGU6IGZ1bmN0aW9uKGUpe1xuICAgIGlmICh0aGlzLmVtYWlsID09PSB1bmRlZmluZWQgfHwgdGhpcy5lbWFpbCA9PT0gJycpe1xuICAgICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnL2xvZ2luJywge3RyaWdnZXI6dHJ1ZX0pO1xuICAgIH1cbiAgICB2YXIgc2F2ZURyaW5rID0gbmV3IFNhdmVEcmluayh7XG4gICAgICBkcmluazogdGhpcy4kKGUuY3VycmVudFRhcmdldCkucGFyZW50KCkucHJldigpLmZpbmQoJy5jb2NrdGFpbFRpdGxlJykudGV4dCgpLFxuICAgICAgbG9jYWxFbWFpbDogdGhpcy5lbWFpbFxuICAgIH0pO1xuXG4gICAgc2F2ZURyaW5rLnNhdmUoW10sIHtcbiAgICAgIGRhdGFUeXBlOid0ZXh0JyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgIGlmIChyZXNwb25zZSA9PT0gXCJTYXZlZCFcIil7XG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5lbWFpbCk7XG4gICAgICAgICAgdGhpcy4kKGUuY3VycmVudFRhcmdldCkuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLiQoZS5jdXJyZW50VGFyZ2V0KS5odG1sKCdTYXZlZCEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzcG9uc2UgPT09IFwiRHVwbGljYXRlXCIpe1xuICAgICAgICAgIGFsZXJ0KCdEcmluayBhbHJlYWR5IGluIHlvdXIgbGlzdCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cblx0cmVuZGVyTG9nZ2VkSW46IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICB2YXIgc2F2ZWRJdGVtcyA9IG5ldyBTYXZlZEl0ZW1zKCk7XG5cbiAgICBzYXZlZEl0ZW1zLnNldCh7bG9jYWxFbWFpbDp0aGl6LmVtYWlsfSk7XG5cbiAgICBzYXZlZEl0ZW1zLnNhdmUoW10sIHtcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsZW5ndGgnLCB0aGl6LmNvbGxlY3Rpb24ubGVuZ3RoKTtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmxlbmd0aCAhPT0gMCl7XG4gICAgICAgICAgdGhpei5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24oZHJpbmspe1xuICAgICAgICAgICAgZm9yICh2YXIgZWFjaCBpbiByZXNwb25zZSl7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlW2VhY2hdLm5hbWUsIGRyaW5rLmdldCgnbmFtZScpKVxuICAgICAgICAgICAgICBpZiAocmVzcG9uc2VbZWFjaF0ubmFtZSA9PT0gZHJpbmsuZ2V0KCduYW1lJykpe1xuICAgICAgICAgICAgICAgIHZhciBkcmlua1ZpZXcgPSBuZXcgRHJpbmtWaWV3KHttb2RlbDpkcmluaywgbWF0Y2g6dHJ1ZX0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdmFyIGRyaW5rVmlldyA9IG5ldyBEcmlua1ZpZXcoe21vZGVsOmRyaW5rLCBtYXRjaDpmYWxzZX0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGl6LiRlbC5hcHBlbmQoZHJpbmtWaWV3LnJlbmRlckxvZ2dlZEluKCkuZWwpO1xuICAgICAgICAgIH0sdGhpeik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpei5yZW5kZXJOb3RMb2dnZWRJbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG5cdH0sXG5cbiAgcmVuZGVyTm90TG9nZ2VkSW46IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGRyaW5rKXtcbiAgICAgIHZhciBkcmlua1ZpZXcgPSBuZXcgRHJpbmtWaWV3KHttb2RlbDpkcmlua30pO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kKGRyaW5rVmlldy5yZW5kZXJOb3RMb2dnZWRJbigpLmVsKTtcbiAgICB9LHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHR0YWdOYW1lOiAnZGl2Jyxcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdH0sXG5cdHJlbmRlckxvZ2dlZEluOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLm1hdGNoID09PSB0cnVlKXtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3RlbXBsYXRlcy9yZXN1bHRzVmlld19kaXNhYmxlZC5oYnMnKTtcbiAgICAgIHRoaXMuJGVsLmh0bWwodGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSkpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgdmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL3Jlc3VsdHNWaWV3LmhicycpO1xuICAgICAgdGhpcy4kZWwuaHRtbCh0ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSk7XG4gICAgfVxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG4gIHJlbmRlck5vdExvZ2dlZEluOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi90ZW1wbGF0ZXMvcmVzdWx0c1ZpZXcuaGJzJyk7XG4gICAgdGhpcy4kZWwuaHRtbCh0ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufSk7XG4gIiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL2ZpcnN0UXVlc3Rpb24uaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdH0sXG5cblx0ZXZlbnRzOiB7XG5cdFx0J2NsaWNrICN0YWcnIDogJ2dldFRhZydcblx0fSxcblxuXHRnZXRUYWc6IGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgdGFnID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2NsYXNzJyk7XG5cdFx0dGhpcy4kZWwuZGV0YWNoKCk7XG5cdFx0QmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSggdGFnLCB7IHRyaWdnZXI6dHJ1ZSB9ICk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaW5kZXggPSB0ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKTtcblx0XHR0aGlzLiRlbC5odG1sKGluZGV4KTtcbiAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxufSk7XG4iLCJ2YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi90ZW1wbGF0ZXMvaW5kZXguaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHR0YWdOYW1lOiAnZGl2Jyxcblx0Y2xhc3NOYW1lOiAncGFnZScsXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaW5kZXggPSB0ZW1wbGF0ZShcIlwiKTtcblx0XHR0aGlzLiRlbC5odG1sKGluZGV4KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG59KTtcbiIsInZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3RlbXBsYXRlcy9sb2dpbi5oYnMnKTtcbnZhciBVc2VyPSByZXF1aXJlKCcuLi9tb2RlbHMvVXNlci5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvZ2dlZEluID0gZmFsc2U7XG5cdFx0dGhpcy5yZW5kZXIoKTtcblx0fSxcblxuXHRldmVudHM6IHtcblx0XHQnY2xpY2sgI2xvZ2luJyA6ICdhdHRlbXB0TG9naW4nXG5cdH0sXG5cblx0YXR0ZW1wdExvZ2luOiBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgdGhpeiA9IHRoaXNcbiAgICAgIHZhciBlbWFpbCA9ICAkKHRoaXMuZWwpLmZpbmQoJyNlbWFpbElucHV0JykudmFsKCk7XG4gICAgICB2YXIgcGFzc3dvcmQgPSAgJCh0aGlzLmVsKS5maW5kKCcjcGFzc3dvcmRJbnB1dCcpLnZhbCgpO1xuICAgICAgdmFyIGxvZ2luID0gbmV3IFVzZXIoe2xvY2FsRW1haWw6ZW1haWwsIGxvY2FsUGFzc3dvcmQ6cGFzc3dvcmR9KTtcbiAgICAgIHRoaXMubW9kZWwuc2V0KHtsb2NhbEVtYWlsOmVtYWlsfSk7XG5cbiAgICAgIGxvZ2luLnNhdmUoW10se1xuICAgICAgICBkYXRhVHlwZTpcInRleHRcIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24obW9kZWwsIHJlc3BvbnNlKXtcbiAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IFwiZmFpbFwiKXtcbiAgICAgICAgICAgIHRoaXouJCgnI2JhZENyZWRlbnRpYWxzJykuaHRtbCgnd3JvbmcgY3JlZGVudGlhbHMnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKCcjbG9nZ2VkSW5OYW1lJykuaHRtbCh0aGl6Lm1vZGVsLmdldCgnbG9jYWxFbWFpbCcpKTtcbiAgICAgICAgICAgIEJhY2tib25lLmhpc3RvcnkubmF2aWdhdGUoJy8nLCB7dHJpZ2dlcjp0cnVlfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24obW9kZWwsIHJlc3BvbnNlKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhtb2RlbCwgcmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBsb2dpbkh0bWwgPSB0ZW1wbGF0ZShcIlwiKTtcblx0XHR0aGlzLiRlbC5odG1sKGxvZ2luSHRtbCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxufSk7IiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL3NhdmVkSXRlbXMuaGJzJyk7XG52YXIgU2F2ZWRJdGVtcyA9IHJlcXVpcmUoJy4uL21vZGVscy9TYXZlZEl0ZW1zLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgfSxcblxuICBzZXRMb2dpbjogZnVuY3Rpb24obG9naW4pe1xuICAgIHRoaXMuZW1haWwgPSBsb2dpbjtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmVtYWlsKTtcbiAgfSxcblxuICBmZXRjaDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRoaXogPSB0aGlzO1xuICAgIHZhciBzYXZlZEl0ZW1zID0gbmV3IFNhdmVkSXRlbXMoe2xvY2FsRW1haWw6dGhpcy5lbWFpbH0pO1xuICAgIGNvbnNvbGUubG9nKCdzYXZlZEl0ZW1zJywgc2F2ZWRJdGVtcyk7XG4gICAgLy91c2luZyBzYXZlIGhlcmUgLSBjb3VsZCBub3QgcGFzcyBwYXlsb2FkIHdpdGhcbiAgICAvL2ZldGNoL2dldCByZXF1ZXN0XG4gICAgc2F2ZWRJdGVtcy5zYXZlKG51bGwsIHtcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICB0aGl6LmRhdGFiYXNlUmV0dXJuID0gcmVzcG9uc2U7XG4gICAgICB0aGl6LnJlbmRlcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRoaXogPSB0aGlzO1xuXHRcdHZhciBzYXZlZEl0ZW1zSHRtbCA9IHRlbXBsYXRlKHRoaXouZGF0YWJhc2VSZXR1cm4pO1xuXHRcdHRoaXMuJGVsLmh0bWwoc2F2ZWRJdGVtc0h0bWwpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyIsInZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3RlbXBsYXRlcy9zZWNvbmRRdWVzdGlvbi5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7fSxcblxuXHRldmVudHM6IHtcblx0XHQnY2xpY2sgI2luZ3JlZGllbnQnIDogJ2dldEluZ3JlZGllbnQnXG5cdH0sXG5cblx0c2V0VGFnOiBmdW5jdGlvbih0YWcpIHtcblx0XHR0aGlzLnRhZyA9IHRhZztcblx0fSxcblxuXHRnZXRJbmdyZWRpZW50OiBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIGluZ3JlZGllbnQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignY2xhc3MnKTtcblx0XHR0aGlzLiRlbC5kZXRhY2goKTtcblx0XHRCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCAncmVzdWx0cy8nKyB0aGlzLnRhZyArJy8nKyBpbmdyZWRpZW50LCB7dHJpZ2dlcjp0cnVlfSApO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGluZGV4ID0gdGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSk7XG5cdFx0dGhpcy4kZWwuaHRtbChpbmRleCk7XG5cdFx0dGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pO1xuIiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL3NpZ251cC5oYnMnKTtcbnZhciBTaWduVXAgPSByZXF1aXJlKCcuLi9tb2RlbHMvU2lnblVwLmpzJyk7XG52YXIgZm9ybVZhbGlkYXRpb24gPSByZXF1aXJlKCcuLi8uLi9VdGlsL2Zvcm1WYWxpZGF0aW9uLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAnY2xpY2sgI3NpZ251cCcgOiAnc2lnbnVwJyxcbiAgICAgICdjbGljayAjQ2FuY2VsJyA6ICdjYW5jZWwnXG4gICAgfSxcblxuICAgIGNhbmNlbDogZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCcvJywge3RyaWdnZXI6dHJ1ZX0pO1xuICAgIH0sXG5cbiAgICBzaWdudXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgIHZhciBuYW1lID0gJCh0aGlzLmVsKS5maW5kKCcjbmFtZScpLnZhbCgpO1xuICAgICAgdmFyIGVtYWlsID0gICQodGhpcy5lbCkuZmluZCgnI2VtYWlsSW5wdXQnKS52YWwoKTtcbiAgICAgIHZhciBwYXNzd29yZCA9ICAkKHRoaXMuZWwpLmZpbmQoJyNwYXNzd29yZElucHV0JykudmFsKCk7XG4gICAgICB2YXIgdmVyaWZ5UGFzc3dvcmQgPSAgJCh0aGlzLmVsKS5maW5kKCcjdmVyaWZ5UGFzc3dvcmQnKS52YWwoKTtcblxuICAgICAgaWYgKGZvcm1WYWxpZGF0aW9uKG5hbWUsZW1haWwscGFzc3dvcmQsdmVyaWZ5UGFzc3dvcmQpPT09ZmFsc2Upe1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBzaWduVXAgPSBuZXcgU2lnblVwKHtcbiAgICAgICAgbmFtZTpuYW1lLFxuICAgICAgICBsb2NhbEVtYWlsOmVtYWlsLFxuICAgICAgICBsb2NhbFBhc3N3b3JkOnBhc3N3b3JkXG4gICAgICB9KTtcblxuICAgICAgc2lnblVwLnNhdmUoW10se1xuICAgICAgICBkYXRhVHlwZTogJ3RleHQnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihtb2RlbCwgcmVzcG9uc2Upe1xuICAgICAgICAgIGlmKHJlc3BvbnNlID09PSAnVGhpcyB1c2VyIGFscmVhZHkgZXhpc3RzJyl7XG4gICAgICAgICAgICB0aGl6LiQoZS5jdXJyZW50VGFyZ2V0KS5odG1sKCdVc2VyIGFscmVhZHkgZXhpc3RzJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0aGl6Lm1vZGVsLnNldCh7bG9jYWxFbWFpbDplbWFpbH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMubW9kZWwnLCB0aGl6Lm1vZGVsKTtcblxuICAgICAgICAgICAgJCgnI2xvZ2dlZEluTmFtZScpLmh0bWwodGhpei5tb2RlbC5nZXQoJ2xvY2FsRW1haWwnKSk7XG4gICAgICAgICAgICBCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCcvJywge3RyaWdnZXI6dHJ1ZX0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9LFxuXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNpZ251cEh0bWwgPSB0ZW1wbGF0ZShcIlwiKTtcbiAgICAgIHRoaXMuJGVsLmh0bWwoc2lnbnVwSHRtbCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59KTsiLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgc2VsZj10aGlzO1xuXG5mdW5jdGlvbiBwcm9ncmFtMShkZXB0aDAsZGF0YSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyO1xuICBidWZmZXIgKz0gXCJcXG48ZGl2IGNsYXNzPVxcXCJsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEwIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zIHRleHQtY2VudGVyXFxcIj5cXG4gICAgPGJ1dHRvbiBpZD1cXFwidGFnXFxcIiBjbGFzcz1cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudGFnKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnRhZyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmxhYmVsKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmxhYmVsKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvYnV0dG9uPlxcbjwvZGl2PlxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwicXVlc3Rpb24gZnVsbCBsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEwIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zIHRleHQtY2VudGVyXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMucXVlc3Rpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAucXVlc3Rpb24pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9kaXY+XFxuPC9kaXY+XFxuXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAuY2hvaWNlcyksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbSgxLCBwcm9ncmFtMSwgZGF0YSksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG5cXG5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgXG5cblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJvZmYtY2FudmFzLXdyYXBcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwiaW5uZXItd3JhcFxcXCI+XFxuICAgIDxuYXYgY2xhc3M9XFxcInRhYi1iYXJcXFwiPlxcbiAgICAgIDxzZWN0aW9uIGNsYXNzPVxcXCJsZWZ0LXNtYWxsXFxcIj5cXG4gICAgICAgIDxhIGNsYXNzPVxcXCJsZWZ0LW9mZi1jYW52YXMtdG9nZ2xlIG1lbnUtaWNvblxcXCI+XFxuICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cXG4gICAgICAgIDwvYT5cXG4gICAgICA8L3NlY3Rpb24+XFxuICAgICAgPHNlY3Rpb24gY2xhc3M9XFxcIm1pZGRsZSB0YWItYmFyLXNlY3Rpb25cXFwiPlxcbiAgICAgICAgPGEgaHJlZj1cXFwiL1xcXCI+PGltZyBpZD1cXFwibG9nb1xcXCIgc3JjPVxcXCIuLi9hc3NldHMvaW1hZ2VzL3RvYXN0aWUucG5nXFxcIi8+PC9hPlxcbiAgICAgIDwvc2VjdGlvbj5cXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVxcXCJyaWdodFxcXCI+XFxuICAgICAgICAgICAgPGgyIGlkPVxcXCJsb2dnZWRJbk5hbWVcXFwiPjwvaDI+XFxuICAgICAgICA8L3NlY3Rpb24+XFxuICAgIDwvbmF2PlxcbiAgICA8YXNpZGUgY2xhc3M9XFxcImxlZnQtb2ZmLWNhbnZhcy1tZW51XFxcIj5cXG4gICAgICA8dWwgY2xhc3M9XFxcIm9mZi1jYW52YXMtbGlzdFxcXCI+XFxuICAgICAgICA8bGk+PGEgaHJlZj1cXFwiI2xvZ2luXFxcIj5Mb2cgaW48L2E+PC9saT5cXG4gICAgICAgIDxsaT48YSBocmVmPVxcXCIvbG9nb3V0XFxcIj5Mb2cgb3V0PC9hPjwvbGk+XFxuICAgICAgICA8bGk+PGEgaHJlZj1cXFwiI215QWNjb3VudFxcXCI+TXkgQWNjb3VudDwvYT48L2xpPlxcbiAgICAgICAgPGxpPjxhIGhyZWY9XFxcIiNzYXZlZEl0ZW1zXFxcIj5TYXZlZCBJdGVtczwvYT48L2xpPlxcbiAgICAgIDwvdWw+XFxuICAgIDwvYXNpZGU+XFxuICAgIDxpIGNsYXNzPVxcXCJmYS1tZW51XFxcIj48L2k+XFxuXFxuICAgIDxhIGNsYXNzPVxcXCJleGl0LW9mZi1jYW52YXNcXFwiPjwvYT5cXG5cXG4gIDxkaXYgY2xhc3M9UXVlc3Rpb24+PC9kaXY+XFxuICA8ZGl2IGNsYXNzPVJlc3VsdD48L2Rpdj5cXG5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcblwiO1xuICB9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICBcblxuXG4gIHJldHVybiBcIjxkaXYgY2xhc3M9XFxcImxvZ2luRm9ybSBzbWFsbC0xMiBtZWRpdW0tOCBsYXJnZS04IHNtYWxsLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBsYXJnZS1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgPGZvcm0gY2xhc3M9XFxcImxvZ2luRm9ybVxcXCIgYWN0aW9uPVxcXCIvbG9naW5cXFwiIG1ldGhvZD1cXFwicG9zdFxcXCI+XFxuICAgICAgICA8aW5wdXQgaWQ9XFxcImVtYWlsSW5wdXRcXFwiIG5hbWU9XFxcImVtYWlsXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiZW1haWxcXFwiPlxcbiAgICAgICAgPGlucHV0IGlkPVxcXCJwYXNzd29yZElucHV0XFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcInBhc3N3b3Jkc1xcXCI+XFxuICAgICAgICA8YSBjbGFzcz1cXFwic3ViLWxpbmVcXFwiIGhyZWY9XFxcIlxcXCI+Rm9yZ290IHlvdXIgcGFzc3dvcmQ/PC9hPlxcbiAgICAgICAgPGJ1dHRvbiBpZD1cXFwibG9naW5cXFwiIHR5cGU9XFxcInN1Ym1pdFxcXCI+U2lnbi1pbjwvYnV0dG9uPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiRGl2aWRlckRpdiBzbWFsbC0xMiBtZWRpdW0tOCBsYXJnZS04IHNtYWxsLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBsYXJnZS1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiZGl2aWRlclxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJkaXZpZGVyV29yZFxcXCI+b3I8L3NwYW4+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImRpdmlkZXJcXFwiPjwvc3Bhbj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Zvcm0+XFxuICAgIDxkaXYgaWQ9XFxcImNyZWF0ZUFjY291bnRcXFwiIGNsYXNzPVxcXCJzbWFsbC0xMiBtZWRpdW0tOCBsYXJnZS04IHNtYWxsLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBsYXJnZS1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNzaWdudXBcXFwiPkNyZWF0ZSBhbiBBY2NvdW50PC9hPlxcbiAgICA8L2Rpdj5cXG4gICAgPGgxIGlkPVxcXCJiYWRDcmVkZW50aWFsc1xcXCI+PC9oMT5cXG48L2Rpdj5cXG5cIjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgXG5cblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJsb2dpbkZvcm0gc21hbGwtMTIgbWVkaXVtLTggbGFyZ2UtOCBzbWFsbC1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgbGFyZ2UtY2VudGVyZWQgY29sdW1uc1xcXCI+XFxuICAgIDxoMT5cXG4gICAgICBFZGl0IEFjY291bnQgSW5mb1xcbiAgICA8L2gxPlxcbiAgICA8aDIgaWQ9XFxcInVzZXJOYW1lXFxcIj48L2gyPlxcbiAgICA8Zm9ybSAgbWV0aG9kPVxcXCJwb3N0XFxcIj5cXG4gICAgICAgIDxoMj5WZXJpZnkgSW5mb3JtYXRpb248L2gyPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGlkPVxcXCJ2ZXJpZnlFbWFpbFxcXCIgbmFtZT1cXFwiZW1haWxcXFwiIHBsYWNlaG9sZGVyPVxcXCJlbWFpbFxcXCI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwicGFzc3dvcmRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGlkPVxcXCJ2ZXJpZnlQYXNzd29yZFxcXCIgbmFtZT1cXFwicGFzc3dvcmRcXFwiIHBsYWNlaG9sZGVyPVxcXCJwYXNzd29yZFxcXCI+XFxuXFxuICAgICAgICA8aDI+TmV3IGRldGFpbHM8L2gyPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGlkPVxcXCJuZXdOYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiBwbGFjZWhvbGRlcj1cXFwiTmFtZVxcXCI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgaWQ9XFxcIm5ld0VtYWlsXFxcIiBuYW1lPVxcXCJlbWFpbFxcXCIgcGxhY2Vob2xkZXI9XFxcImVtYWlsXFxcIj5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgaWQ9XFxcIm5ld1Bhc3N3b3JkXFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgcGxhY2Vob2xkZXI9XFxcInBhc3N3b3JkXFxcIj5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgaWQ9XFxcIm5ld1Bhc3N3b3JkVmVyaWZ5XFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgcGxhY2Vob2xkZXI9XFxcInZlcmlmeSBwYXNzd29yZFxcXCI+XFxuICAgICAgICA8YnV0dG9uIGlkPVxcXCJlZGl0SW5mb1xcXCI+RWRpdDwvYnV0dG9uPlxcbiAgICA8L2Zvcm0+XFxuICAgIDxoMSBpZD1cXFwiZXJyb3JzXFxcIj48L2gxPlxcbjwvZGl2PlwiO1xuICB9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuXG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiY29ja3RhaWxSZWNpcGVJdGVtIGxhcmdlLTggbWVkaXVtLTggc21hbGwtMTIgbGFyZ2UtY2VudGVyZWQgbWVkaXVtLWNlbnRlcmVkIHNtYWxsLWNlbnRlcmVkIGNvbHVtbnNcXFwiPlxcbiAgICA8dWw+XFxuICAgICAgICA8bGkgY2xhc3M9XFxcImNvY2t0YWlsSW1hZ2VcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5pbWcpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuaW1nKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgICAgICA8bGkgY2xhc3M9XFxcImNvY2t0YWlsVGl0bGVcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5uYW1lKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLm5hbWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxEZXNjcmlwdGlvblxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmRlc2NyaXB0aW9uKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmRlc2NyaXB0aW9uKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgICAgICA8bGkgY2xhc3M9XFxcImNvY2t0YWlsU2VydmluZ1xcXCI+TWFrZXMgXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnNlcnZpbmdzKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnNlcnZpbmdzKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIiBzZXJ2aW5nczwvbGk+XFxuICAgICAgICA8bGk+PHNwYW4gY2xhc3M9XFxcInRpdGxlUmVjaXBlXFxcIj5JbmdyZWRpZW50czogPC9zcGFuPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5pbmdyZWRpZW50cykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5pbmdyZWRpZW50cyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICAgICAgPGxpPjxzcGFuIGNsYXNzPVxcXCJ0aXRsZVJlY2lwZVxcXCI+UmVjaXBlOjwvc3Bhbj4gXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmRpcmVjdGlvbnMpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuZGlyZWN0aW9ucyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICA8L3VsPlxcbiAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTggbWVkaXVtLTggc21hbGwtMTAgbGFyZ2UtY2VudGVyZWQgbWVkaXVtLWNlbnRlcmVkIHNtYWxsLWNlbnRlcmVkIGNvbHVtbnNcXFwiPiA8YnV0dG9uIGNsYXNzPVxcXCJyZWNpcGVCdXR0b25cXFwiPlNhdmUgSXRlbTwvYnV0dG9uPjxidXR0b24gY2xhc3M9XFxcInJlY2lwZUJ1dHRvblxcXCI+U2hhcmUhPC9idXR0b24+PC9kaXY+XFxuPC9kaXY+XFxuXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cblxuICBidWZmZXIgKz0gXCI8ZGl2IGNsYXNzPVxcXCJjb2NrdGFpbFJlY2lwZUl0ZW0gbGFyZ2UtOCBtZWRpdW0tOCBzbWFsbC0xMiBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1uc1xcXCI+XFxuICAgIDx1bD5cXG4gICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxJbWFnZVxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmltZykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5pbWcpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxUaXRsZVxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLm5hbWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAubmFtZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICAgICAgPGxpIGNsYXNzPVxcXCJjb2NrdGFpbERlc2NyaXB0aW9uXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuZGVzY3JpcHRpb24pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxTZXJ2aW5nXFxcIj5tYWtlcyBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuc2VydmluZ3MpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuc2VydmluZ3MpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiIHNlcnZpbmdzPC9saT5cXG4gICAgICAgIDxsaT48c3BhbiBjbGFzcz1cXFwidGl0bGVSZWNpcGVcXFwiPkluZ3JlZGllbnRzOiA8L3NwYW4+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmluZ3JlZGllbnRzKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmluZ3JlZGllbnRzKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgICAgICA8bGk+PHNwYW4gY2xhc3M9XFxcInRpdGxlUmVjaXBlXFxcIj5SZWNpcGU6PC9zcGFuPiBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuZGlyZWN0aW9ucykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5kaXJlY3Rpb25zKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgIDwvdWw+XFxuICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtOCBtZWRpdW0tOCBzbWFsbC0xMCBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1uc1xcXCI+IDxidXR0b24gY2xhc3M9XFxcInJlY2lwZUJ1dHRvblxcXCIgZGlzYWJsZWQ+QWxyZWFkeSBTYXZlZDwvYnV0dG9uPjxidXR0b24gY2xhc3M9XFxcInJlY2lwZUJ1dHRvblxcXCI+U2hhcmUhPC9idXR0b24+PC9kaXY+XFxuPC9kaXY+XCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBzZWxmPXRoaXM7XG5cbmZ1bmN0aW9uIHByb2dyYW0xKGRlcHRoMCxkYXRhKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgPHVsPlxcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxJbWFnZVxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmltZykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5pbWcpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9saT5cXG4gICAgICAgICAgICA8bGkgY2xhc3M9XFxcImNvY2t0YWlsVGl0bGVcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5uYW1lKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLm5hbWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9saT5cXG4gICAgICAgICAgICA8bGkgY2xhc3M9XFxcImNvY2t0YWlsRGVzY3JpcHRpb25cXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5kZXNjcmlwdGlvbikgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5kZXNjcmlwdGlvbik7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxTZXJ2aW5nXFxcIj5tYWtlcyBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuc2VydmluZ3MpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuc2VydmluZ3MpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiIHNlcnZpbmdzPC9saT5cXG4gICAgICAgICAgICA8bGk+PHNwYW4gY2xhc3M9XFxcInRpdGxlUmVjaXBlXFxcIj5JbmdyZWRpZW50czogPC9zcGFuPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5pbmdyZWRpZW50cykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5pbmdyZWRpZW50cyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICAgICAgICAgIDxsaT48c3BhbiBjbGFzcz1cXFwidGl0bGVSZWNpcGVcXFwiPlJlY2lwZTo8L3NwYW4+IFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5kaXJlY3Rpb25zKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmRpcmVjdGlvbnMpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9saT5cXG4gICAgICAgIDwvdWw+XFxuICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbmZ1bmN0aW9uIHByb2dyYW0zKGRlcHRoMCxkYXRhKSB7XG4gIFxuICBcbiAgcmV0dXJuIFwiXFxuICAgICAgICA8aDE+Tm90aGluZyB0byBkaXNwbGF5IC0gYWRkIGl0ZW1zPC9oMT5cXG4gICAgXCI7XG4gIH1cblxuICBidWZmZXIgKz0gXCI8ZGl2IGNsYXNzPVxcXCJjb2NrdGFpbFJlY2lwZUl0ZW0gbGFyZ2UtOCBtZWRpdW0tOCBzbWFsbC0xMiBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1uc1xcXCI+XFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIGRlcHRoMCwge2hhc2g6e30saW52ZXJzZTpzZWxmLnByb2dyYW0oMywgcHJvZ3JhbTMsIGRhdGEpLGZuOnNlbGYucHJvZ3JhbSgxLCBwcm9ncmFtMSwgZGF0YSksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgc2VsZj10aGlzO1xuXG5mdW5jdGlvbiBwcm9ncmFtMShkZXB0aDAsZGF0YSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyO1xuICBidWZmZXIgKz0gXCJcXG48ZGl2IGNsYXNzPVxcXCJsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEwIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zIHRleHQtY2VudGVyXFxcIj5cXG4gICAgPGJ1dHRvbiBpZD1cXFwiaW5ncmVkaWVudFxcXCIgY2xhc3M9XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmluZ3JlZGllbnQpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuaW5ncmVkaWVudCk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmxhYmVsKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmxhYmVsKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvYnV0dG9uPlxcbjwvZGl2PlxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwicXVlc3Rpb24gZnVsbCBsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEwIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zIHRleHQtY2VudGVyXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMucXVlc3Rpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAucXVlc3Rpb24pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAuY2hvaWNlcyksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbSgxLCBwcm9ncmFtMSwgZGF0YSksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG5cXG5cXG5cXG5cXG5cXG5cXG5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgXG5cblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJsb2dpbkZvcm0gc21hbGwtMTIgbWVkaXVtLTggbGFyZ2UtOCBzbWFsbC1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgbGFyZ2UtY2VudGVyZWQgY29sdW1uc1xcXCI+XFxuICAgIDxoMT5cXG4gICAgICAgIENyZWF0ZSBBY2NvdW50XFxuICAgIDwvaDE+XFxuICAgIDxmb3JtIGFjdGlvbj1cXFwiI3NpZ251cFxcXCI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgaWQ9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIHBsYWNlaG9sZGVyPVxcXCJOYW1lXFxcIj5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBpZD1cXFwiZW1haWxJbnB1dFxcXCIgbmFtZT1cXFwiZW1haWxcXFwiIHBsYWNlaG9sZGVyPVxcXCJlbWFpbFxcXCI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwicGFzc3dvcmRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGlkPVxcXCJwYXNzd29yZElucHV0XFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgcGxhY2Vob2xkZXI9XFxcInBhc3N3b3JkXFxcIj5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgaWQ9XFxcInZlcmlmeVBhc3N3b3JkXFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgcGxhY2Vob2xkZXI9XFxcImNvbmZpcm0gcGFzd29yZFxcXCI+XFxuICAgICAgICA8YnV0dG9uIGlkPVxcXCJzaWdudXBcXFwiPkNyZWF0ZSBBY2NvdW50PC9idXR0b24+XFxuICAgIDwvZm9ybT5cXG4gICAgPGJ1dHRvbiBpZD1cXFwiQ2FuY2VsXFxcIj5DYW5jZWw8L2J1dHRvbj5cXG4gICAgPGgxIGlkPVxcXCJlcnJvcnNcXFwiPjwvaDE+XFxuPC9kaXY+XFxuXCI7XG4gIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmdsb2JhbHMgSGFuZGxlYmFyczogdHJ1ZSAqL1xudmFyIGJhc2UgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2Jhc2VcIik7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvdXRpbHNcIik7XG52YXIgcnVudGltZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvcnVudGltZVwiKTtcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG52YXIgY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG5cbiAgaGIuVk0gPSBydW50aW1lO1xuICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG4gIH07XG5cbiAgcmV0dXJuIGhiO1xufTtcblxudmFyIEhhbmRsZWJhcnMgPSBjcmVhdGUoKTtcbkhhbmRsZWJhcnMuY3JlYXRlID0gY3JlYXRlO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhhbmRsZWJhcnM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVkVSU0lPTiA9IFwiMS4zLjBcIjtcbmV4cG9ydHMuVkVSU0lPTiA9IFZFUlNJT047dmFyIENPTVBJTEVSX1JFVklTSU9OID0gNDtcbmV4cG9ydHMuQ09NUElMRVJfUkVWSVNJT04gPSBDT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0ge1xuICAxOiAnPD0gMS4wLnJjLjInLCAvLyAxLjAucmMuMiBpcyBhY3R1YWxseSByZXYyIGJ1dCBkb2Vzbid0IHJlcG9ydCBpdFxuICAyOiAnPT0gMS4wLjAtcmMuMycsXG4gIDM6ICc9PSAxLjAuMC1yYy40JyxcbiAgNDogJz49IDEuMC4wJ1xufTtcbmV4cG9ydHMuUkVWSVNJT05fQ0hBTkdFUyA9IFJFVklTSU9OX0NIQU5HRVM7XG52YXIgaXNBcnJheSA9IFV0aWxzLmlzQXJyYXksXG4gICAgaXNGdW5jdGlvbiA9IFV0aWxzLmlzRnVuY3Rpb24sXG4gICAgdG9TdHJpbmcgPSBVdGlscy50b1N0cmluZyxcbiAgICBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscykge1xuICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG5cbiAgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcbn1cblxuZXhwb3J0cy5IYW5kbGViYXJzRW52aXJvbm1lbnQgPSBIYW5kbGViYXJzRW52aXJvbm1lbnQ7SGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuICBsb2dnZXI6IGxvZ2dlcixcbiAgbG9nOiBsb2csXG5cbiAgcmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUsIGZuLCBpbnZlcnNlKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChpbnZlcnNlIHx8IGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpOyB9XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGludmVyc2UpIHsgZm4ubm90ID0gaW52ZXJzZTsgfVxuICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuXG4gIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSwgc3RyKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLnBhcnRpYWxzLCAgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBzdHI7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdoZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk1pc3NpbmcgaGVscGVyOiAnXCIgKyBhcmcgKyBcIidcIik7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignYmxvY2tIZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlIHx8IGZ1bmN0aW9uKCkge30sIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmKGNvbnRleHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICB9IGVsc2UgaWYoY29udGV4dCA9PT0gZmFsc2UgfHwgY29udGV4dCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgIGlmKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVycy5lYWNoKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbihjb250ZXh0KTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdlYWNoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBmbiA9IG9wdGlvbnMuZm4sIGludmVyc2UgPSBvcHRpb25zLmludmVyc2U7XG4gICAgdmFyIGkgPSAwLCByZXQgPSBcIlwiLCBkYXRhO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuXG4gICAgaWYoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICAgIGZvcih2YXIgaiA9IGNvbnRleHQubGVuZ3RoOyBpPGo7IGkrKykge1xuICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICBkYXRhLmxhc3QgID0gKGkgPT09IChjb250ZXh0Lmxlbmd0aC0xKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbaV0sIHsgZGF0YTogZGF0YSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gY29udGV4dCkge1xuICAgICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgaWYoZGF0YSkgeyBcbiAgICAgICAgICAgICAgZGF0YS5rZXkgPSBrZXk7IFxuICAgICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRba2V5XSwge2RhdGE6IGRhdGF9KTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihpID09PSAwKXtcbiAgICAgIHJldCA9IGludmVyc2UodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2lmJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb25kaXRpb25hbCkpIHsgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpOyB9XG5cbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJlbmRlciB0aGUgcG9zaXRpdmUgcGF0aCBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5IGFuZCBub3QgZW1wdHkuXG4gICAgLy8gVGhlIGBpbmNsdWRlWmVyb2Agb3B0aW9uIG1heSBiZSBzZXQgdG8gdHJlYXQgdGhlIGNvbmR0aW9uYWwgYXMgcHVyZWx5IG5vdCBlbXB0eSBiYXNlZCBvbiB0aGVcbiAgICAvLyBiZWhhdmlvciBvZiBpc0VtcHR5LiBFZmZlY3RpdmVseSB0aGlzIGRldGVybWluZXMgaWYgMCBpcyBoYW5kbGVkIGJ5IHRoZSBwb3NpdGl2ZSBwYXRoIG9yIG5lZ2F0aXZlLlxuICAgIGlmICgoIW9wdGlvbnMuaGFzaC5pbmNsdWRlWmVybyAmJiAhY29uZGl0aW9uYWwpIHx8IFV0aWxzLmlzRW1wdHkoY29uZGl0aW9uYWwpKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5mbih0aGlzKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd1bmxlc3MnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzWydpZiddLmNhbGwodGhpcywgY29uZGl0aW9uYWwsIHtmbjogb3B0aW9ucy5pbnZlcnNlLCBpbnZlcnNlOiBvcHRpb25zLmZuLCBoYXNoOiBvcHRpb25zLmhhc2h9KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKCFVdGlscy5pc0VtcHR5KGNvbnRleHQpKSByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgbGV2ZWwgPSBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhLmxldmVsICE9IG51bGwgPyBwYXJzZUludChvcHRpb25zLmRhdGEubGV2ZWwsIDEwKSA6IDE7XG4gICAgaW5zdGFuY2UubG9nKGxldmVsLCBjb250ZXh0KTtcbiAgfSk7XG59XG5cbnZhciBsb2dnZXIgPSB7XG4gIG1ldGhvZE1hcDogeyAwOiAnZGVidWcnLCAxOiAnaW5mbycsIDI6ICd3YXJuJywgMzogJ2Vycm9yJyB9LFxuXG4gIC8vIFN0YXRlIGVudW1cbiAgREVCVUc6IDAsXG4gIElORk86IDEsXG4gIFdBUk46IDIsXG4gIEVSUk9SOiAzLFxuICBsZXZlbDogMyxcblxuICAvLyBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgaG9zdCBlbnZpcm9ubWVudFxuICBsb2c6IGZ1bmN0aW9uKGxldmVsLCBvYmopIHtcbiAgICBpZiAobG9nZ2VyLmxldmVsIDw9IGxldmVsKSB7XG4gICAgICB2YXIgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGVbbWV0aG9kXSkge1xuICAgICAgICBjb25zb2xlW21ldGhvZF0uY2FsbChjb25zb2xlLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbmV4cG9ydHMubG9nZ2VyID0gbG9nZ2VyO1xuZnVuY3Rpb24gbG9nKGxldmVsLCBvYmopIHsgbG9nZ2VyLmxvZyhsZXZlbCwgb2JqKTsgfVxuXG5leHBvcnRzLmxvZyA9IGxvZzt2YXIgY3JlYXRlRnJhbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICBVdGlscy5leHRlbmQob2JqLCBvYmplY3QpO1xuICByZXR1cm4gb2JqO1xufTtcbmV4cG9ydHMuY3JlYXRlRnJhbWUgPSBjcmVhdGVGcmFtZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGVycm9yUHJvcHMgPSBbJ2Rlc2NyaXB0aW9uJywgJ2ZpbGVOYW1lJywgJ2xpbmVOdW1iZXInLCAnbWVzc2FnZScsICduYW1lJywgJ251bWJlcicsICdzdGFjayddO1xuXG5mdW5jdGlvbiBFeGNlcHRpb24obWVzc2FnZSwgbm9kZSkge1xuICB2YXIgbGluZTtcbiAgaWYgKG5vZGUgJiYgbm9kZS5maXJzdExpbmUpIHtcbiAgICBsaW5lID0gbm9kZS5maXJzdExpbmU7XG5cbiAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cblxuICB2YXIgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgaWYgKGxpbmUpIHtcbiAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uID0gbm9kZS5maXJzdENvbHVtbjtcbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXhjZXB0aW9uOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBDT01QSUxFUl9SRVZJU0lPTiA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuUkVWSVNJT05fQ0hBTkdFUztcblxuZnVuY3Rpb24gY2hlY2tSZXZpc2lvbihjb21waWxlckluZm8pIHtcbiAgdmFyIGNvbXBpbGVyUmV2aXNpb24gPSBjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdIHx8IDEsXG4gICAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcbiAgICAgIHZhciBydW50aW1lVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2N1cnJlbnRSZXZpc2lvbl0sXG4gICAgICAgICAgY29tcGlsZXJWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY29tcGlsZXJSZXZpc2lvbl07XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBwcmVjb21waWxlciB0byBhIG5ld2VyIHZlcnNpb24gKFwiK3J1bnRpbWVWZXJzaW9ucytcIikgb3IgZG93bmdyYWRlIHlvdXIgcnVudGltZSB0byBhbiBvbGRlciB2ZXJzaW9uIChcIitjb21waWxlclZlcnNpb25zK1wiKS5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVzZSB0aGUgZW1iZWRkZWQgdmVyc2lvbiBpbmZvIHNpbmNlIHRoZSBydW50aW1lIGRvZXNuJ3Qga25vdyBhYm91dCB0aGlzIHJldmlzaW9uIHlldFxuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGEgbmV3ZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJJbmZvWzFdK1wiKS5cIik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuY2hlY2tSZXZpc2lvbiA9IGNoZWNrUmV2aXNpb247Ly8gVE9ETzogUmVtb3ZlIHRoaXMgbGluZSBhbmQgYnJlYWsgdXAgY29tcGlsZVBhcnRpYWxcblxuZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTm8gZW52aXJvbm1lbnQgcGFzc2VkIHRvIHRlbXBsYXRlXCIpO1xuICB9XG5cbiAgLy8gTm90ZTogVXNpbmcgZW52LlZNIHJlZmVyZW5jZXMgcmF0aGVyIHRoYW4gbG9jYWwgdmFyIHJlZmVyZW5jZXMgdGhyb3VnaG91dCB0aGlzIHNlY3Rpb24gdG8gYWxsb3dcbiAgLy8gZm9yIGV4dGVybmFsIHVzZXJzIHRvIG92ZXJyaWRlIHRoZXNlIGFzIHBzdWVkby1zdXBwb3J0ZWQgQVBJcy5cbiAgdmFyIGludm9rZVBhcnRpYWxXcmFwcGVyID0gZnVuY3Rpb24ocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW52LlZNLmludm9rZVBhcnRpYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzdWx0ICE9IG51bGwpIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gICAgaWYgKGVudi5jb21waWxlKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHsgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG4gICAgICBwYXJ0aWFsc1tuYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHsgZGF0YTogZGF0YSAhPT0gdW5kZWZpbmVkIH0sIGVudik7XG4gICAgICByZXR1cm4gcGFydGlhbHNbbmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgY29tcGlsZWQgd2hlbiBydW5uaW5nIGluIHJ1bnRpbWUtb25seSBtb2RlXCIpO1xuICAgIH1cbiAgfTtcblxuICAvLyBKdXN0IGFkZCB3YXRlclxuICB2YXIgY29udGFpbmVyID0ge1xuICAgIGVzY2FwZUV4cHJlc3Npb246IFV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG4gICAgaW52b2tlUGFydGlhbDogaW52b2tlUGFydGlhbFdyYXBwZXIsXG4gICAgcHJvZ3JhbXM6IFtdLFxuICAgIHByb2dyYW06IGZ1bmN0aW9uKGksIGZuLCBkYXRhKSB7XG4gICAgICB2YXIgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldO1xuICAgICAgaWYoZGF0YSkge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHByb2dyYW0oaSwgZm4sIGRhdGEpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gcHJvZ3JhbShpLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG4gICAgfSxcbiAgICBtZXJnZTogZnVuY3Rpb24ocGFyYW0sIGNvbW1vbikge1xuICAgICAgdmFyIHJldCA9IHBhcmFtIHx8IGNvbW1vbjtcblxuICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbiAmJiAocGFyYW0gIT09IGNvbW1vbikpIHtcbiAgICAgICAgcmV0ID0ge307XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIGNvbW1vbik7XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIHBhcmFtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcbiAgICBwcm9ncmFtV2l0aERlcHRoOiBlbnYuVk0ucHJvZ3JhbVdpdGhEZXB0aCxcbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IG51bGxcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBuYW1lc3BhY2UgPSBvcHRpb25zLnBhcnRpYWwgPyBvcHRpb25zIDogZW52LFxuICAgICAgICBoZWxwZXJzLFxuICAgICAgICBwYXJ0aWFscztcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBoZWxwZXJzID0gb3B0aW9ucy5oZWxwZXJzO1xuICAgICAgcGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gdGVtcGxhdGVTcGVjLmNhbGwoXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIG5hbWVzcGFjZSwgY29udGV4dCxcbiAgICAgICAgICBoZWxwZXJzLFxuICAgICAgICAgIHBhcnRpYWxzLFxuICAgICAgICAgIG9wdGlvbnMuZGF0YSk7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgZW52LlZNLmNoZWNrUmV2aXNpb24oY29udGFpbmVyLmNvbXBpbGVySW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuZXhwb3J0cy50ZW1wbGF0ZSA9IHRlbXBsYXRlO2Z1bmN0aW9uIHByb2dyYW1XaXRoRGVwdGgoaSwgZm4sIGRhdGEgLyosICRkZXB0aCAqLykge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG5cbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgW2NvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhXS5jb25jYXQoYXJncykpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gYXJncy5sZW5ndGg7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW1XaXRoRGVwdGggPSBwcm9ncmFtV2l0aERlcHRoO2Z1bmN0aW9uIHByb2dyYW0oaSwgZm4sIGRhdGEpIHtcbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGEpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gMDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbSA9IHByb2dyYW07ZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICB2YXIgb3B0aW9ucyA9IHsgcGFydGlhbDogdHJ1ZSwgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG5cbiAgaWYocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBmb3VuZFwiKTtcbiAgfSBlbHNlIGlmKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydHMuaW52b2tlUGFydGlhbCA9IGludm9rZVBhcnRpYWw7ZnVuY3Rpb24gbm9vcCgpIHsgcmV0dXJuIFwiXCI7IH1cblxuZXhwb3J0cy5ub29wID0gbm9vcDsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIEJ1aWxkIG91dCBvdXIgYmFzaWMgU2FmZVN0cmluZyB0eXBlXG5mdW5jdGlvbiBTYWZlU3RyaW5nKHN0cmluZykge1xuICB0aGlzLnN0cmluZyA9IHN0cmluZztcbn1cblxuU2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFwiXCIgKyB0aGlzLnN0cmluZztcbn07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU2FmZVN0cmluZzsiLCJcInVzZSBzdHJpY3RcIjtcbi8qanNoaW50IC1XMDA0ICovXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIGVzY2FwZSA9IHtcbiAgXCImXCI6IFwiJmFtcDtcIixcbiAgXCI8XCI6IFwiJmx0O1wiLFxuICBcIj5cIjogXCImZ3Q7XCIsXG4gICdcIic6IFwiJnF1b3Q7XCIsXG4gIFwiJ1wiOiBcIiYjeDI3O1wiLFxuICBcImBcIjogXCImI3g2MDtcIlxufTtcblxudmFyIGJhZENoYXJzID0gL1smPD5cIidgXS9nO1xudmFyIHBvc3NpYmxlID0gL1smPD5cIidgXS87XG5cbmZ1bmN0aW9uIGVzY2FwZUNoYXIoY2hyKSB7XG4gIHJldHVybiBlc2NhcGVbY2hyXSB8fCBcIiZhbXA7XCI7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChvYmosIHZhbHVlKSB7XG4gIGZvcih2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSB7XG4gICAgICBvYmpba2V5XSA9IHZhbHVlW2tleV07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO3ZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4vLyBTb3VyY2VkIGZyb20gbG9kYXNoXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0XG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59O1xuLy8gZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpXG5pZiAoaXNGdW5jdGlvbigveC8pKSB7XG4gIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gIH07XG59XG52YXIgaXNGdW5jdGlvbjtcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSA/IHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nIDogZmFsc2U7XG59O1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICBpZiAoc3RyaW5nIGluc3RhbmNlb2YgU2FmZVN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICghc3RyaW5nICYmIHN0cmluZyAhPT0gMCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuICAvLyBhbiBvYmplY3QncyB0byBzdHJpbmcgaGFzIGVzY2FwZWQgY2hhcmFjdGVycyBpbiBpdC5cbiAgc3RyaW5nID0gXCJcIiArIHN0cmluZztcblxuICBpZighcG9zc2libGUudGVzdChzdHJpbmcpKSB7IHJldHVybiBzdHJpbmc7IH1cbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGJhZENoYXJzLCBlc2NhcGVDaGFyKTtcbn1cblxuZXhwb3J0cy5lc2NhcGVFeHByZXNzaW9uID0gZXNjYXBlRXhwcmVzc2lvbjtmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTsiLCIvLyBDcmVhdGUgYSBzaW1wbGUgcGF0aCBhbGlhcyB0byBhbGxvdyBicm93c2VyaWZ5IHRvIHJlc29sdmVcbi8vIHRoZSBydW50aW1lIG9uIGEgc3VwcG9ydGVkIHBhdGguXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lJyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIilbXCJkZWZhdWx0XCJdO1xuIl19
