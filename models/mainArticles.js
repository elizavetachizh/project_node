var mongoose = require("mongoose");

// Page Schema
var mainArticlesSchema = mongoose.Schema({
  content: {
    type: String,
  },
  image: {
    type: String,
  },
});

const mainArticle = mongoose.model("mainArticle", mainArticlesSchema);
module.exports = mainArticle;
