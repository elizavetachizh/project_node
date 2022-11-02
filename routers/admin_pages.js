const express = require("express");
const router = express.Router();
const Page = require("../models/page");
const auth = require("../config/auth");
const isAdmin = auth.isAdmin;

router.get("/", isAdmin, function (req, res) {
  Page.find({})
    .sort({ sorting: 1 })
    .exec(function (err, pages) {
      res.render("admin/pages", {
        pages: pages,
      });
    });
});
router.get("/add_page", isAdmin, function (req, res) {
  var title = "";
  var slug = "";
  var content = "";
  res.render("admin/add_page", {
    title: title,
    slug: slug,
    content: content,
  });
});

router.post("/add_page", (req, res) => {
  req.checkBody("title", "Заголовок должен быть заполненым").notEmpty();
  req.checkBody("content", "Контент должен быть заполненым").notEmpty();

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
  if (slug === "") slug = title.replace(/\s+/g, "-").toLowerCase();
  var content = req.body.content;

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_page", {
      errors: errors,
      title: title,
      slug: slug,
      content: content,
    });
  } else {
    Page.findOne({ slug: slug }, function (err, page) {
      if (page) {
        req
          .checkBody(
            "title",
            "Данная страницы была создана ранее, попробуйте создать новую"
          )
          .notEmpty();
        req.flash(
          "danger",
          "Данная страницы была создана ранее, попробуйте создать новую"
        );
        res.render("admin/add_page", {
          title: title,
          slug: slug,
          content: content,
        });
      } else {
        var page = new Page({
          title: title,
          slug: slug,
          content: content,
          sorting: 100,
        });

        page.save(function (err) {
          if (err) {
            return console.log(err);
          }
          Page.find({})
            .sort({ sorting: 1 })
            .exec(function (err, pages) {
              if (err) {
                return console.log(err);
              } else {
                req.app.locals.pages = pages;
              }
            });
        });

        req.flash("success", "Страница добавлена");
        res.redirect("/admin_page");
      }
    });
  }
});

/*
 * GET edit page
 */
router.get("/edit-page/:id", isAdmin, function (req, res) {
  Page.findById(req.params.id, function (err, page) {
    if (err) return console.log(err);
    res.render("admin/edit_page", {
      title: page.title,
      slug: page.slug,
      content: page.content,
      id: page._id,
    });
  });
});

/*
 * POST edit page
 */
router.post("/edit-page/:id", function (req, res) {
  req.checkBody("title", "Title must have a value.").notEmpty();
  req.checkBody("content", "Content must have a value.").notEmpty();

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
  if (slug === "") slug = title.replace(/\s+/g, "-").toLowerCase();
  var content = req.body.content;
  var id = req.body.id;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/edit_page", {
      errors: errors,
      title: title,
      slug: slug,
      content: content,
      id: id,
    });
  } else {
    Page.findOne({ slug: slug, _id: { $ne: id } }, function (err, page) {
      if (page) {
        console.log(page);
        req
          .checkBody(
            "slug",
            "Данная страницы была создана ранее, попробуйте создать новую"
          )
          .notEmpty();
        console.log(req.flash("slug"));
        res.render("admin/edit_page", {
          title: title,
          slug: slug,
          content: content,
          id: id,
        });
      } else {
        Page.findById(id, function (err, page) {
          if (err) return console.log(err);
          console.log(page);
          page.title = title;
          page.slug = slug;
          page.content = content;

          page.save(function (err) {
            if (err) return console.log(err);
            console.log(page.id);

            Page.find({})
              .sort({ sorting: 1 })
              .exec(function (err, pages) {
                if (err) {
                  console.log(err);
                } else {
                  req.app.locals.pages = pages;
                }
              });

            req.flash("success", "Страница отредактировна!");
            console.log(req.flash("success"));
            res.redirect("/admin_page/edit-page/" + page.id);
          });
        });
      }
    });
  }
});

/*
 * GET delete page
 */
router.get("/delete-page/:id", isAdmin, function (req, res) {
  Page.findByIdAndRemove(req.params.id, function (err) {
    if (err) return console.log(err);

    Page.find({})
      .sort({ sorting: 1 })
      .exec(function (err, pages) {
        if (err) {
          console.log(err);
        } else {
          req.app.locals.pages = pages;
        }
      });

    req.flash("success", "Page deleted!");
    res.redirect("/admin_page/");
  });
});

module.exports = router;
