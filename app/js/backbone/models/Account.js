module.exports = Backbone.Model.extend({
  url: "http://ianjohnson.co/edit/",
	defaults: {
    verifyEmail: "",
    verifyPassword: "",
    newName: "",
    newEmail: "",
    newPassword: "",
	}
});
