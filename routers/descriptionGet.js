const express = require("express");
const Description = require("../models/descriptionServices");
const router = express.Router();
router.get("/", function (req, res) {
  var count;
  Description.count(function (err, c) {
    count = c;
  });
  Description.find(function (err, description) {
    if (err) {
      console.log(err);
    }
    res.send(description);
    // services.map((el) => {
    //   el.description.forEach((el) => console.log(el));
    // });
  });
});
module.exports = router;
