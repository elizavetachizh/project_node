const express = require("express");
const router = express.Router();
const Posts = require("../models/posts");

router.get("/", function (req, res) {
  var count;
  Posts.count(function (err, c) {
    count = c;
  });
  Posts.find(function (err, posts) {
    // res.render("posts", {
    //   posts: posts,
    //   count: count,
    // });
    res.send(posts);
  });
});

/*
 * GET edit page
 */
router.get("/:link", function (req, res) {
  Posts.findById(req.params.link, function (err, post) {
    if (err) return console.log(err);
    res.render("posts", {
      link: post.title,
      content: post.content,
      id: post._id,
    });
  });
});

module.exports = router;
