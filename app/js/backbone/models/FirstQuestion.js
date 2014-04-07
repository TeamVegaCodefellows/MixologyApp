module.exports = Backbone.Model.extend({
	url: "http://ianjohnson.co/api/v1/getFirstQuestion/",
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
