var mongoose = require("mongoose");

// Category Schema
var ServicesSchema = mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  description: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Description",
    },
  ],
});

const Services = mongoose.model("Services", ServicesSchema);
module.exports = Services;
