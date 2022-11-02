const express = require("express");
const Page = require("../models/page");
const router = express.Router();

/*
 * GET /
 */
router.get('/', function (req, res) {

  Page.findOne({slug: 'home'}, function (err, page) {
    if (err)
      console.log(err);

    res.render('index', {
      title: page.title,
      content: page.content
    });
  });

});

router.get("/:slug", function (req, res) {
  var slug = req.params.slug;

  Page.findOne({ slug: slug }, function (err, page) {
    if (err) console.log(err);
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
