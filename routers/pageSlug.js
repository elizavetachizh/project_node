const express = require("express");
const Page = require("../models/page");
const router = express.Router();

router.get("/:slug", function (req, res) {
  var slug = req.params.slug;

  Page.findOne({ slug: slug }, function (err, page) {
    if (err) console.log(err);
    console.log(page);
    if (!page) {
      res.redirect("/");
    } else {
      res.render("index", {
        title: page.title,
        content: page.content,
      });
      console.log(page)
    }
  });
});
module.exports = router;
