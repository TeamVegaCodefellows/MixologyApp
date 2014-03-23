var View = Backbone.View.extend({

	tagName: 'li',

	initialize: function() {
		this.render();
	},

	render: function() {
		$.ajax({
			url: '/api/v1/getDrink/Vodka/brunch'
		}).done(function(result) {
			var source = $('#drinkTemplate').html();
			var template = Handlebars.compile(source);
			var context = result;
			var html = template(context)
			console.log(html);
			$('body').append(html);
		});
	}

});

var view = new View();
