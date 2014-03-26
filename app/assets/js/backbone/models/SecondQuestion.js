module.exports = Backbone.Model.extend({

  url: 'http://localhost:3000/api/v1/getSecondQuestion',

  defaults: {
    question: "",
    firstOption: [
      {
        "Label" : ""
      },
      {
        "Ingredient" : ""
      }
    ],
    secondOption: [
      {
        "Label" : ""
      },
      {
        "Ingredient" : ""
      }
    ],
    thirdOption: [
      {
        "Label" : ""
      },
      {
        "Ingredient" : ""
      }
    ]
  }

});
