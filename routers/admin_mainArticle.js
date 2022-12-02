const express = require("express");
const router = express.Router();
const { isAdmin } = require("../config/auth");
var alert = require("alert");
const mainArticle = require("../models/mainArticles");
router.get("/", isAdmin, function (req, res) {
  var count;
  mainArticle.count(function (err, c) {
    count = c;
  });
  mainArticle.find(function (err, articles) {
    res.render("admin/admin_articles", {
      articles: articles,
      count: count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-article", isAdmin, function (req, res) {
  var content = "";
  var image = "";
  res.render("admin/add_article", {
    content: content,
    image: image,
  });
});

router.post("/add-article", (req, res) => {
  // req.checkBody("content", "Описание должно быть заполненым").notEmpty();
  // req.checkBody("image", "Картинка должна быть загружена").notEmpty();

  var content = req.body.content;
  var image = req.body.image;

  var errors = req.validationErrors();
  console.log(content);
  if (errors) {
    console.log(errors);
    res.render("admin/add_article", {
      errors: errors,
      content: content,
      image: image,
    });
  } else {
    mainArticle.findOne(
      { content: content, image: image },
      function (err, article) {
        if (article) {
          res.render("admin/add_article", {
            content: content,
            image: image,
          });
        } else {
          var article = new mainArticle({
            content: content,
            image: image,
          });
          console.log(article);
          article.save(function (err) {
            if (err) {
              return console.log(err);
            }
            req.flash("success", "Пост добавлен");
            res.redirect("/admin_article");
          });
        }
      }
    );
  }
});

/*
 * GET edit product
 */
router.get("/edit-article/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  mainArticle.findById(req.params.id, function (err, article) {
    console.log(article);
    if (err) {
      console.log(err);
      res.render("admin/admin_article");
    } else {
      res.render("admin/edit_article", {
        errors: errors,
        content: article.content,
        image: article.image,
        id: article._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-article/:id", function (req, res) {
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();

  var content = req.body.content;
  var image = req.body.image;
  var id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin_article/edit-article/" + id);
  } else {
    mainArticle.findOne(
      { content: content, image: image },
      function (err, article) {
        if (err) {
          console.log(err);
        }
        if (article) {
          console.log("post3", article);
          res.redirect("/admin_article");
        } else {
          mainArticle.findById(id, function (err, article) {
            if (err) return console.log(err);

            article.content = content;
            article.image = image;

            article.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "пост отредактирован!");
              alert("Пост отредактирован");
              res.redirect("/admin_article/edit-article/" + id);
            });
            console.log(article);
          });
        }
      }
    );
  }
});

/*
 * GET delete product
 */
router.get("/delete-article/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  mainArticle.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin_article");
  });
});

module.exports = router;
