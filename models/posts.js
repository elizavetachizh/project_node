var mongoose = require("mongoose");

// Page Schema
var PostsSchema = mongoose.Schema({
  link: {
    type: String,
  },
  content: {
    type: String,
  },
    image: {
        type: String
    }
});

const Posts = mongoose.model("Posts", PostsSchema);
module.exports = Posts;
