var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  idAttribute: 'id',
  urlRoot: 'http://localhost:3000/api/v1/users',
  defaults: {
    first_name: '',
    last_name: '',
    email: ''
  }
});
