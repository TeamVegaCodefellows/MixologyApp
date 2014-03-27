module.exports = Backbone.Model.extend({
	url: "http://localhost:3000/getFirstQuestion/",
	defaults: {
		"question" : "",
		"options" : [
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
