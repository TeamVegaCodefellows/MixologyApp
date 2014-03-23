var View = Backbone.View.extend({

	tagName: 'li',

	initialize: function() {
		this.render();
	},

	render: function() {
		$.ajax({
			url: '/api/v1/getDrink/Smooth sailin/Summer drink'
		}).done(function(result) {
			var source = $('#drinkTemplate').html();
			var template = Handlebars.compile(source);
			var context = result;
			var html = template(context)
			console.log('test', html);
			$('body').append(html);
		});
	}

});

var view = new View();
