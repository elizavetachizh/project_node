const express = require("express");
const router = express.Router();
const Tenders = require("../models/tenders");

router.get("/", function (req, res) {
  Tenders.find(function (err, tenders) {
    // res.render("tenders", {
    //   tenders: tenders,
    // });
     res.send(tenders);
    console.log(tenders);
  });
});
module.exports = router;
