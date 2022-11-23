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
    // console.log(management)
    res.render("admin/admin_management", {
      management: management,
      count: count,
    });
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
      name: departaments,
      department: departaments,
    });
    console.log("1", typeof departaments);
  });
});

router.post("/add-men", (req, res) => {
  var imageFile =
    typeof req.files?.image !== "undefined" ? req.files.image.name : "";

  req.checkBody("fullName", "Название должно быть заполненым").notEmpty();
  req.checkBody("position", "Описание должно быть заполненым").notEmpty();
  req.checkBody("cardImg", "Картинка должна быть загружена").isImage(imageFile);

  var fullName = req.body.fullName;
  var position = req.body.position;
  var name = req.body.name;
  var department = req.body.department;
  console.log(req.body.department);
  console.log("2", typeof department);
  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    Departament.find(function (err, departaments) {
      res.render("admin/add_management", {
        errors: errors,
        fullName: fullName,
        position: position,
        name: departaments,
        department: departaments,
      });
      console.log("3", department);
      console.log("3name", name);
    });
  } else {
    Management.findOne(
      {
        fullName: fullName,
        position: position,
        name: name,
        department: department,
      },
      function (err, men) {
        if (men) {
          console.log(men);
          Departament.find(function (err, departaments) {
            res.render("admin/add_management", {
              fullName: fullName,
              position: position,
              name: departaments,
              department: departaments,
            });
            console.log("4", name);
            console.log("44", departaments);
            console.log("444", department);
          });
        } else {
          var management = new Management({
            fullName: fullName,
            position: position,
            name: name,
            image: imageFile,
            department: department,
          });
          console.log("5", name);
          console.log("55", typeof department);
          management.save(function (err) {
            if (err) {
              return console.log(err);
            }
            // mkdirp("public/product_images/" + product._id, function (err) {
            //   return console.log(err);
            // });

            if (imageFile !== "") {
              let productImage = req.files.image;
              let path = "public/images" + "/" + imageFile;

              productImage.mv(path, function (err) {
                return console.log(err);
              });
            }
            console.log("6", name);
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
  Management.findById(req.params.id, function (err, men) {
    if (err) {
      console.log(err);
      res.render("admin/admin_management");
    } else {
      res.render("admin/edit_management", {
        errors: errors,
        fullName: men.fullName,
        position: men.position,
        name: men.name,
        image: men.image,
        links: men.links,
        id: men._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-men/:id", function (req, res) {
  var imageFile =
    typeof req.files?.image !== "undefined" ? req.files.image.name : "";

  req.checkBody("fullName", "fullName должно быть заполненым").notEmpty();
  req.checkBody("position", "position должно быть заполненым").notEmpty();
  req.checkBody("name", "name должна быть загружена").isImage(imageFile);

  var fullName = req.body.fullName;
  var position = req.body.position;
  var links = req.body.links;
  var name = req.body.name;
  var image = req.body.image;
  var id = req.params.id;
  console.log("fullName", fullName);
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    console.log(errors);
    res.redirect("/admin_management/edit-men/" + id);
  } else {
    Management.findOne(
      { fullName: fullName, position: position, name: name },
      function (err, men) {
        console.log("men", men);
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
            men.name = name;
            men.links = links;
            if (imageFile !== "") {
              men.image = imageFile;
            }
            console.log("fullName1", fullName);
            men.save(function (err) {
              if (err) return console.log(err);

              if (imageFile !== "") {
                if (image !== "") {
                  fs.remove(
                    "public/product_images" + "/" + image,
                    function (err) {
                      if (err) console.log(err);
                    }
                  );
                }

                var productImage = req.files.image;
                var path = "public/product_images/" + imageFile;

                productImage.mv(path, function (err) {
                  return console.log(err);
                });
              }

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
