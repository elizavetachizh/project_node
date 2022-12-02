const Management = require("../models/management");
const { isAdmin } = require("../config/auth");
const express = require("express");
const fs = require("fs-extra");
const alert = require("alert");

const Departament = require("../models/departaments");
const router = express.Router();

router.get("/", isAdmin, function (req, res) {
  var count;
  Management.count(function (err, c) {
    count = c;
  });
  Management.find(function (err, management) {
    res.render("admin/admin_management", {
      management: management,
      count: count,
    });
    console.log(management);
    // res.send(management)
  });
});

/*
 * GET add product
 */
router.get("/add-men", isAdmin, function (req, res) {
  var fullName = "";
  var position = "";
  var image = "";
  Departament.find(function (err, departaments) {
    res.render("admin/add_management", {
      fullName: fullName,
      position: position,
      image: image,
      idDepartment: departaments,
      department: departaments,
    });
  });
});

router.post("/add-men", (req, res) => {
  req.checkBody("fullName", "Название должно быть заполненым").notEmpty();
  req.checkBody("position", "Описание должно быть заполненым").notEmpty();
  req.checkBody("cardImg", "Картинка должна быть загружена").isImage(imageFile);
  var image = req.body.image;

  var fullName = req.body.fullName;
  var position = req.body.position;
  var department = req.body.department;
  console.log("params", req.params);
  console.log("body", req.body);
  var errors = req.validationErrors();
  console.log(department);
  if (errors) {
    console.log(errors);
    Departament.find(function (err, departaments) {
      res.render("admin/add_management", {
        errors: errors,
        fullName: fullName,
        position: position,
        image: image,
        idDepartment: departaments.map((el) => el._id),
        department: departaments,
      });
    });
  } else {
    Management.findOne(
      {
        fullName: fullName,
        position: position,
        department: department,
        image: image,
      },
      function (err, men) {
        if (men) {
          Departament.find(function (err, departaments) {
            res.render("admin/add_management", {
              fullName: fullName,
              position: position,
              image: image,
              idDepartment: departaments.map((el) => el._id),
              department: departaments,
            });
          });
        } else {
          var management = new Management({
            fullName: fullName,
            position: position,
            image: image,
            department: department,
          });
          management.save(function (err) {
            if (err) {
              return console.log(err);
            }
            req.flash("success", "человек добавлен");
            res.redirect("/admin_management");
          });
        }
      }
    );
  }
});

/*
 * GET edit product
 */
router.get("/edit-men/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  Departament.find(function (err, departamnets) {
    Management.findById(req.params.id, function (err, men) {
      if (err) {
        console.log(err);
        res.render("admin/admin_management");
      } else {
        res.render("admin/edit_management", {
          errors: errors,
          fullName: men.fullName,
          position: men.position,
          department: departamnets,
          image: men.image,
          id: men._id,
        });
      }
    });
  });
});

/*
 * POST edit product
 */
router.post("/edit-men/:id", function (req, res) {
  req.checkBody("fullName", "fullName должно быть заполненым").notEmpty();
  req.checkBody("position", "position должно быть заполненым").notEmpty();

  var fullName = req.body.fullName;
  var position = req.body.position;
  var image = req.body.image;
  var id = req.params.id;
  var department = req.body.department;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    console.log(errors);
    res.redirect("/admin_management/edit-men/" + id);
  } else {
    Management.findOne(
      { fullName: fullName, _id: { $ne: id } },
      function (err, men) {
        if (err) {
          console.log(err);
        }
        if (men) {
          console.log("men2", men);
          res.redirect("/admin_management/edit-men/" + id);
        } else {
          Management.findById(id, function (err, men) {
            if (err) return console.log(err);

            men.fullName = fullName;
            men.position = position;
            men.department = department;
            men.image = image;

            men.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "продукция отредактировна!");
              alert("Пост отредактирован");
              res.redirect("/admin_management/edit-men/" + id);
            });
            console.log("men", men);
          });
        }
      }
    );
  }
});

/*
 * GET delete product
 */
router.get("/delete-men/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Management.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin_management/");
  });
});

module.exports = router;
