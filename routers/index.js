const express = require("express");
const Page = require("../models/page");
const router = express.Router();
router.get("/", (req, res) => {
  Page.findOne({ slug: "home" }, function (err, page) {
    if (err) console.log(err);

    res.render("index", {
      title: page.title,
      content: page.content,
    });
  });
});

module.exports = router;
