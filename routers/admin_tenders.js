const express = require("express");
const router = express.Router();
const Tenders = require("../models/tenders");
const { isAdmin } = require("../config/auth");
var alert = require("alert");
router.get("/", isAdmin, function (req, res) {
  var count;
  Tenders.count(function (err, c) {
    count = c;
  });
  Tenders.find(function (err, tenders) {
    res.render("admin/admin_tenders", {
      tenders: tenders,
      count: count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-tender", isAdmin, function (req, res) {
  var content = "";
  res.render("admin/add_tenders", {
    content: content,
  });
});

router.post("/add-tender", (req, res) => {
  req.checkBody("content", "Название должно быть заполненым").notEmpty();

  var content = req.body.content;

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_tenders", {
      errors: errors,
      content: content,
    });
  } else {
    Tenders.findOne({ content: content }, function (err, tender) {
      if (tender) {
        res.render("admin/add_tenders", {
          content: content,
        });
      } else {
        var tender = new Tenders({
          content: content,
        });
        tender.save(function (err) {
          if (err) {
            return console.log(err);
          }
          req.flash("success", "Пост добавлен");
          res.redirect("/admin_tenders");
        });
      }
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-tender/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Tenders.findById(req.params.id, function (err, tender) {
    console.log(tender);
    if (err) {
      console.log(err);
      res.render("admin/admin_tenders");
    } else {
      res.render("admin/edit_tenders", {
        errors: errors,
        content: tender.content,
        id: tender._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-tender/:id", function (req, res) {
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();

  var content = req.body.content;
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin_tenders/edit-tender/" + id);
  } else {
    Tenders.findOne({ content: content }, function (err, tender) {
      if (err) {
        console.log(err);
      }
      if (tender) {
        console.log("tender", tender);
        res.redirect("/admin_tenders");
      } else {
        Tenders.findById(id, function (err, tender) {
          if (err) return console.log(err);
          tender.content = content;

          tender.save(function (err) {
            if (err) return console.log(err);

            req.flash("success", "пост отредактирован!");
            alert("Пост отредактирован");
            res.redirect("/admin_tenders/edit-tender/" + id);
          });
          console.log(tender);
        });
      }
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-tender/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Tenders.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin_tenders/");
  });
});

module.exports = router;
