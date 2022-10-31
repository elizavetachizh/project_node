const express = require("express");
const router = express.Router();
const Page = require("../models/page");
router.get("/", (req, res) => {
  Page.find({})
    .exec(function (err, pages) {
      res.render("admin/pages", {
        pages: pages,
      });
    });
});

module.exports = router;
