const express = require("express");
const router = express.Router();
const Description = require("../models/descriptionServices");
const { isAdmin } = require("../config/auth");
const alert = require("alert");

router.get("/", function (req, res) {
  Description.find(function (err, description) {
    if (err) {
      console.log(err);
    }
    res.render("admin/admin_description", {
      description: description,
    });
    // res.send(description)
    console.log(description);
  });
});

/*
 * GET add product
 */
router.get("/add-description", function (req, res) {
  var inform = "";
  var nameDescription = "";
  res.render("admin/add_description", {
    inform: inform,
    nameDescription: nameDescription,
  });
});

router.post("/add-description", function (req, res) {
  req.checkBody("inform", "inform должен быть заполненым").notEmpty();
  req
    .checkBody("nameDescription", "nameDescription должен быть заполненым")
    .notEmpty();
  var inform = req.body.inform;
  var nameDescription = req.body.nameDescription;
  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_description", {
      errors: errors,
      inform: inform,
      nameDescription: nameDescription,
    });
  } else {
    Description.findOne(
      {
        inform: inform,
        nameDescription: nameDescription,
      },
      function (err, description) {
        if (description) {
          res.render("admin/add_description", {
            inform: inform,
            nameDescription: nameDescription,
          });
        } else {
          var description = new Description({
            inform: inform,
            nameDescription: nameDescription,
          });
          description.save(function (err) {
            if (err) {
              return console.log(err);
            }
            res.redirect("/admin_description");
          });
        }
      }
    );
  }
});

/*
 * GET edit product
 */
router.get("/edit-description/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  Description.findById(req.params.id, function (err, description) {
    if (err) {
      console.log(err);
      res.render("admin/admin_description");
    } else {
      res.render("admin/edit_description", {
        errors: errors,
        nameDescription: description.nameDescription,
        inform: description.inform,
        id: description._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-description/:id", function (req, res) {
  req
    .checkBody("nameDescription", "nameDescription должно быть заполненым")
    .notEmpty();
  req.checkBody("inform", "inform должно быть заполненым").notEmpty();

  var nameDescription = req.body.nameDescription;
  var inform = req.body.inform;
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    console.log(errors);
    res.redirect("/admin_description/edit-description/" + id);
  } else {
    Description.findOne(
      { nameDescription: nameDescription, inform: inform, _id: { $ne: id } },
      function (err, description) {
        if (err) {
          console.log(err);
        }
        if (description) {
          console.log("men2", description);
          res.redirect("/admin_description/edit-description/" + id);
        } else {
          Description.findById(id, function (err, description) {
            if (err) return console.log(err);

            description.nameDescription = nameDescription;
            description.inform = inform;

            description.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "продукция отредактировна!");
              alert("Пост отредактирован");
              res.redirect("/admin_description/edit-description/" + id);
            });
            console.log("men", description);
          });
        }
      }
    );
  }
});

/*
 * GET delete product
 */
router.get("/delete-description/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Description.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin_description/");
  });
});

module.exports = router;
