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
