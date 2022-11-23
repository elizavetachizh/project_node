const Departaments = require("../models/departaments");
const { isAdmin } = require("../config/auth");
const express = require("express");
const alert = require("alert");
const Management = require("../models/management");
const router = express.Router();

router.get("/", isAdmin, function (req, res) {
  var count;
  Departaments.count(function (err, c) {
    count = c;
  });
  Departaments.find(function (err, departament) {
    res.render("admin/admin_departament", {
      departament: departament,
      count: count,
    });
    // res.send(management)
  });
});

/*
 * GET add product
 */
router.get("/add-departament", isAdmin, function (req, res) {
  var name = "";
  res.render("admin/add_departament", {
    name: name,
  });
});

router.post("/add-departament", (req, res) => {
  var name = req.body.name;
  var idMen = req.body.idMen;
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);

    res.render("admin/add_departament", {
      errors: errors,
      name: name,
    });
  } else {
    Departaments.findOne({ name: name }, function (err, departament) {
      if (departament) {
        res.render("admin/add_departament", {
          name: name,
        });
      } else {
        var departament = new Departaments({
          name: name,
        });
        departament.save(function (err) {
          if (err) {
            return console.log(err);
          }
          req.flash("success", "departament добавлен");
          res.redirect("/admin_departament");
        });
      }
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-departament/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  Departaments.findById(req.params.id, function (err, departament) {
    if (err) {
      console.log(err);
      res.render("admin/admin_departament");
    } else {
      res.render("admin/edit_departament", {
        errors: errors,
        name: departament.name,
        id: departament._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-departament/:id", function (req, res) {
  var name = req.body.name;
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    console.log(errors);
    res.redirect("/admin_departament/edit-departament/" + id);
  } else {
    Departaments.findOne({ name: name }, function (err, departament) {
      if (err) {
        console.log(err);
      }
      if (departament) {
        res.redirect("/admin_departament/edit-departament/" + id);
      } else {
        Departaments.findById(id, function (err, men) {
          if (err) return console.log(err);

          departament.name = name;

          departament.save(function (err) {
            if (err) return console.log(err);

            req.flash("success", "продукция отредактировна!");
            alert("Пост отредактирован");
            res.redirect("/admin_departament/edit-departament/" + id);
          });
        });
      }
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-departament/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Departaments.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin_departament/");
  });
});

module.exports = router;
