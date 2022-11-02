const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const auth = require("../config/auth");
const isAdmin = auth.isAdmin;
router.get("/", isAdmin, function (req, res) {
  Category.find({})
    .sort({ sorting: 1 })
    .exec(function (err, categories) {
      res.render("admin/admin_category", {
        categories: categories,
      });
    });
});

/*
 * GET add category
 */
router.get("/add_category", isAdmin, function (req, res) {
  var title = "";

  res.render("admin/add_category", {
    title: title,
  });
});

router.post("/add_category", (req, res) => {
  req.checkBody("title", "Заголовок должен быть заполненым").notEmpty();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_category", {
      errors: errors,
      title: title,
      slug: slug,
    });
  } else {
    Category.findOne({ slug: slug }, function (err, category) {
      if (category) {
        req.flash(
          "danger",
          "Данная категория была создана ранее, попробуйте создать новую"
        );
        console.log(req.flash("danger"));
        res.render("admin/add_category", {
          title: title,
          slug: slug,
        });
      } else {
        var category = new Category({
          title: title,
          slug: slug,
        });

        category.save(function (err) {
          if (err) {
            return console.log(err);
          }
          Category.find(function (err, categories) {
            if (err) {
              return console.log(err);
            } else {
              req.app.locals.categories = categories;
            }
          });
        });

        req.flash("success", "Категория добавлена");
        res.redirect("/admin_category");
      }
    });
  }
});

/*
 * GET edit categories
 */
router.get("/edit-category/:id", isAdmin, function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    if (err) return console.log(err);
    res.render("admin/edit_category", {
      title: category.title,
      id: category._id,
    });
  });
});

/*
 * POST edit page
 */
router.post("/edit-category/:id", function (req, res) {
  req.checkBody("title", "Title must have a value.").notEmpty();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  var id = req.body.id;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/edit_category", {
      errors: errors,
      title: title,
      id: id,
    });
  } else {
    Category.findOne(
      { slug: slug, _id: { $ne: id } },
      function (err, category) {
        if (category) {
          req.flash("danger", "category slug exists, choose another.");
          res.render("admin/edit_category", {
            title: title,
            id: id,
          });
        } else {
          Category.findById(req.params.id, function (err, category) {
            if (err) return console.log(err);

            category.title = title;
            category.slug = slug;

            category.save(function (err) {
              if (err) return console.log(err);

              Category.find(function (err, categories) {
                if (err) {
                  return console.log(err);
                } else {
                  req.app.locals.categories = categories;
                }
              });

              req.flash("success", "category отредактировна!");
              res.redirect("/admin_category");
            });
          });
        }
      }
    );
  }
});

/*
 * GET delete page
 */
router.get("/delete-category/:id", isAdmin, function (req, res) {
  Category.findByIdAndRemove(req.params.id, function (err) {
    if (err) return console.log(err);

    Category.find(function (err, categories) {
      if (err) {
        return console.log(err);
      } else {
        req.app.locals.categories = categories;
      }
    });

    req.flash("success", "categories deleted!");
    res.redirect("/admin_category/");
  });
});

module.exports = router;
