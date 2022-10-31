const express = require("express");
const router = express.Router();
const Page = require("../models/page");
router.get("/", (req, res) => {
  Page.findOne({ slug: "home" }, function (err, page) {
    if (err) console.log(err);

    res.render("page", {
      title: page.title,
      content: page.content,
    });
  });
});

module.exports = router;
