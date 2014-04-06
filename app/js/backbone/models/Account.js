module.exports = Backbone.Model.extend({
  url: "http://localhost:3000/edit/",
	defaults: {
    verifyEmail: "",
    verifyPassword: "",
    newName: "",
    newEmail: "",
    newPassword: "",
	}
});
