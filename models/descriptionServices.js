var mongoose = require("mongoose");

// Category Schema
var DescriptionSchema = mongoose.Schema({
  nameDescription: {
    type: String,
  },
  inform: {
    type: String,
  },
});

const Description = mongoose.model("Description", DescriptionSchema);
module.exports = Description;
