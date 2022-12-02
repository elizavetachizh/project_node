const express = require("express");
const router = express.Router();
const auth = require("../config/auth");
const Management = require("../models/management");
const isUser = auth.isUser;
router.get("/", function (req, res) {
  Management.find(function (err, management) {

    // res.render("managment", {
    //   management: management,
    // });
    console.log(management);
    res.send(management);
  });
});

module.exports = router;
