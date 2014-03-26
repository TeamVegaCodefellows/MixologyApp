module.exports = Backbone.Model.extend({

  url: 'http://localhost:3000/api/v1/getFirstQuestion',

  defaults: {
    question: "",
    firstOption: [
      {
        "Label" : ""
      },
      {
        "Tag" : ""
      }
    ],
    secondOption: [
      {
        "Label" : ""
      },
      {
        "Tag" : ""
      }
    ],
    thirdOption: [
      {
        "Label" : ""
      },
      {
        "Tag" : ""
      }
    ]
  }

});
