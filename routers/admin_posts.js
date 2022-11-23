const express = require("express");
const router = express.Router();
const Posts = require("../models/posts");
const { isAdmin } = require("../config/auth");
var alert = require("alert");
router.get("/", isAdmin, function (req, res) {
  var count;
  Posts.count(function (err, c) {
    count = c;
  });
  Posts.find(function (err, posts) {
    res.render("admin/admin_posts", {
      posts: posts,
      count: count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-post", isAdmin, function (req, res) {
  var link = "";
  var content = "";
  var image = "";
  res.render("admin/add_posts", {
    link: link,
    content: content,
    image: image,
  });
});

router.post("/add-post", (req, res) => {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();
  req.checkBody("image", "Картинка должна быть загружена").notEmpty();

  var link = req.body.link;
  var content = req.body.content;
  var image = req.body.image;

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_posts", {
      errors: errors,
      link: link,
      content: content,
      image: image,
    });
  } else {
    Posts.findOne({ link: link }, function (err, post) {
      if (post) {
        res.render("admin/add_posts", {
          link: link,
          content: content,
          image: image,
        });
      } else {
        var post = new Posts({
          link: link,
          content: content,
          image: image,
        });
        post.save(function (err) {
          if (err) {
            return console.log(err);
          }
          req.flash("success", "Пост добавлен");
          res.redirect("/admin_posts");
        });
      }
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-post/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Posts.findById(req.params.id, function (err, post) {
    console.log(post);
    if (err) {
      console.log(err);
      res.render("admin/admin_posts");
    } else {
      res.render("admin/edit_post", {
        errors: errors,
        link: post.link,
        content: post.content,
        image: post.image,
        id: post._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-post/:id", function (req, res) {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();

  var link = req.body.link;
  var content = req.body.content;
  var image = req.body.image;
  var id = req.params.id;
  console.log("link", link);
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin_posts/edit-post/" + id);
  } else {
    Posts.findOne(
      { link: link, content: content, image: image },
      function (err, post) {
        console.log("post2", post);
        if (err) {
          console.log(err);
        }
        if (post) {
          console.log("post3", post);
          res.redirect("/admin_posts");
        } else {
          Posts.findById(id, function (err, post) {
            if (err) return console.log(err);

            post.link = link;
            post.content = content;
            post.image = image;

            console.log("post", post);
            console.log("link111", link);

            post.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "пост отредактирован!");
              alert("Пост отредактирован");
              res.redirect("/admin_posts/edit-post/" + id);
            });
            console.log(post);
          });
        }
      }
    );
  }
});

/*
 * GET delete product
 */
router.get("/delete-post/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Posts.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin_posts/");
  });
});

module.exports = router;
