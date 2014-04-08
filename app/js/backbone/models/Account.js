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
