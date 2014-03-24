module.exports = Backbone.Router.extend({
	routes: {
		"test/:id" : "test"
	},
	initialize: function() {
		console.log('initialized');
	},
	test: function(id){
		console.log('this', id);
	}
});
