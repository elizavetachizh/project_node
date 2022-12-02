const express = require("express");
const Description = require("../models/descriptionServices");
const Services = require("../models/services");
const router = express.Router();
router.get("/", function (req, res) {
  var count;
  Services.count(function (err, c) {
    count = c;
  });
  Services.find({})
    .populate({ path: "description", select: "inform nameDescription" })
    .exec(function (err, services) {
      if (err) {
        console.log(err);
      }
      res.send(services);
      console.log(services);
      // services.map((el) => {
      //   el.description.forEach((el) => console.log(el));
      // });
    });
});
module.exports = router;
