const express = require("express");
const router = express.Router();
const Services = require("../models/services");
const Description = require("../models/descriptionServices");
const { isAdmin } = require("../config/auth");
const Posts = require("../models/posts");
const alert = require("alert");

router.get("/", function (req, res) {
  var count;
  Services.count(function (err, c) {
    count = c;
  });
  Services.find({})
    .populate({
      path: "description",
      match: { _id: req.body._id },
    })

    .exec(function (err, services) {
      if (err) {
        console.log(err);
      }
      res.render("admin/admin_services", {
        services: services,
      });
      // services.map((el) => {
      //   el.description.forEach((el) => console.log(el));
      // });
      console.log(services);
      services.map((el) => console.log(el.description));
    });
});
let services = Services.find({}).populate("description");
console.log(services);
/*
 * GET add product
 */
router.get("/add-services", function (req, res) {
  var id = req.params._id;
  var name = "";
  var image = "";
  var description = [];
  Services.find({ _id: { $ne: id } })
    .populate("description")
    .exec(function (err, services) {
      if (err) console.log(err);

      res.render("admin/add_services", {
        services: services,
        name: name,
        image: image,
        description: description,
      });
      console.log("ser2", description);
    });
});

router.post("/add-services", function (req, res) {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("image", "Картинка должна быть загружена").notEmpty();
  const image = req.body.image;
  const name = req.body.name;
  const description = req.body.description.split(",");
  console.log(description);
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("admin/add_services", {
      errors: errors,
      description: description,
      name: name,
      image: image,
    });
  } else {
    Services.findOne({ name: name, image: image })
      .populate({ path: "description", match: { _id: req.body._id } })
      .exec(function (err, services) {
        if (services) {
          res.render("admin/add_services", {
            image: image,
            name: name,
            description: description,
          });
        } else {
          var services = new Services({
            name: name,
            image: image,
            description: description,
          });
          services.save(function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("fdgxdfg", services);
            console.log(services.description);
            req.flash("success", "человек добавлен");
            res.redirect("/admin_services");
          });
        }
      });
  }
});

/*
 * GET edit product
 */
router.get("/edit-services/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Services.findById(req.params.id, function (err, service) {
    console.log(service.description);

    if (err) {
      console.log(err);
      res.render("admin/admin_services");
    } else {
      res.render("admin/edit_services", {
        errors: errors,
        description: service.description,
        name: service.content,
        image: service.image,
        id: service._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-services/:id", function (req, res) {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("image", "Описание должно быть заполненым").notEmpty();

  var name = req.body.name;
  var image = req.body.image;
  var id = req.params.id;
  const description = req.body.description.split(",");
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin_services/edit-services/" + id);
  } else {
    Posts.findOne(
      { name: name, description: description, image: image },
      function (err, service) {
        console.log("post2", service);
        if (err) {
          console.log(err);
        }
        if (service) {
          console.log("post3", service);
          res.redirect("/admin_services");
        } else {
          Services.findById(id, function (err, service) {
            if (err) return console.log(err);

            service.name = name;
            service.description = description;
            service.image = image;

            console.log("post", service);

            service.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "пост отредактирован!");
              alert("Пост отредактирован");
              res.redirect("/admin_services/edit-services/" + id);
            });
            console.log(service);
          });
        }
      }
    );
  }
});

/*
 * GET delete product
 */
router.get("/delete-services/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Services.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin_services/");
  });
});

module.exports = router;
