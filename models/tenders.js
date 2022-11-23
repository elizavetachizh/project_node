var mongoose = require("mongoose");

// Category Schema
var TendersSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const Tenders = mongoose.model("Tenders", TendersSchema);
module.exports = Tenders;
