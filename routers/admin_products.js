const express = require("express");
const router = express.Router();
const Products = require("../models/products");
const Category = require("../models/category");
const auth = require("../config/auth");
const isAdmin = auth.isAdmin;
const fs = require("fs-extra");
router.get("/", isAdmin, function (req, res) {
  var count;
  Products.count(function (err, c) {
    count = c;
  });

  Products.find(function (err, products) {
    console.log(count);
    res.render("admin/admin_products", {
      products: products,
      count: count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-product", isAdmin, function (req, res) {
  var title = "";
  var desc = "";
  var price = "";

  Category.find(function (err, categories) {
    res.render("admin/add_products", {
      title: title,
      desc: desc,
      categories: categories,
      price: price,
    });
  });
});

router.post("/add-product", (req, res) => {
  var imageFile =
    typeof req.files?.image !== "undefined" ? req.files.image.name : "";

  req.checkBody("title", "Название должно быть заполненым").notEmpty();
  req.checkBody("desc", "Описание должно быть заполненым").notEmpty();
  req.checkBody("image", "Картинка должна быть загружена").isImage(imageFile);

  //должно быть числовым
  req.checkBody("price", "Цена должна быть указана").isDecimal();

  var title = req.body.title;
  var desc = req.body.desc;
  var price = req.body.price;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  var category = req.body.category;

  var errors = req.validationErrors();

  if (errors) {
    Category.find(function (err, categories) {
      res.render("admin/add_products", {
        errors: errors,
        title: title,
        desc: desc,
        categories: categories,
        price: price,
      });
    });
  } else {
    Products.findOne({ slug: slug }, function (err, product) {
      if (product) {
        Category.find(function (err, categories) {
          res.render("admin/add_products", {
            title: title,
            desc: desc,
            categories: categories,
            price: price,
          });
        });
      } else {
        var priceDouble = parseFloat(price).toFixed(2);

        var product = new Products({
          title: title,
          slug: slug,
          desc: desc,
          category: category,
          price: priceDouble,
          image: imageFile,
        });

        product.save(function (err) {
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
          req.flash("success", "Категория добавлена");
          res.redirect("/admin_products");
        });
      }
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-product/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  Category.find(function (err, categories) {
    Products.findById(req.params.id, function (err, product) {
      if (err) {
        console.log(err);
        res.render("admin/admin_products");

      } else {

            res.render("admin/edit_products", {
              errors: errors,
              title: product.title,
              desc: product.desc,
              category: product.category.replace(/\s+/g, "-").toLowerCase(),
              categories: categories,
              price: parseFloat(product.price).toFixed(2),
              image: product.image,
              id: product._id,
            });

      }
    });
  });
});

/*
 * POST edit product
 */
router.post("/edit-product/:id", function (req, res) {
  var imageFile =
    typeof req.files?.image !== "undefined" ? req.files.image.name : "";

  req.checkBody("title", "Название должно быть заполненым").notEmpty();
  req.checkBody("desc", "Описание должно быть заполненым").notEmpty();
  req.checkBody("image", "Картинка должна быть загружена").isImage(imageFile);

  //должно быть числовым
  req.checkBody("price", "Цена должна быть указана").isDecimal();

  var title = req.body.title;
  var desc = req.body.desc;
  var price = req.body.price;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  var category = req.body.category;
  var image = req.body.image;
  var id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin_products/edit-product/" + id);
  } else {
    Products.findOne({ slug: slug, _id: { $ne: id } }, function (err, product) {
      if (err) {
        console.log(err);
      }
      if (product) {
        res.redirect("/admin_products/edit-product/" + id);
      } else {
        Products.findById(id, function (err, product) {
          if (err) return console.log(err);
          product.title = title;
          product.slug = slug;
          product.desc = desc;
          product.category = category;
          product.price = parseFloat(price).toFixed(2);
          if (imageFile !== "") {
            product.image = imageFile;
          }

          product.save(function (err) {
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
            console.log(req.flash("success"));

            res.redirect("/admin_products/edit-product/" + id);
          });
        });
      }
    });
  }
});

/*
 * GET delete image
 */
router.get("/delete-image/:image", isAdmin, function (req, res) {
  var originalImage =
    "public/product_images/" + req.query.id + "/gallery/" + req.params.image;
  var thumbImage =
    "public/product_images/" +
    req.query.id +
    "/gallery/thumbs/" +
    req.params.image;

  fs.remove(originalImage, function (err) {
    if (err) {
      console.log(err);
    } else {
      fs.remove(thumbImage, function (err) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Image deleted!");
          res.redirect("/admin_products/edit-product/" + req.query.id);
        }
      });
    }
  });
});

/*
 * GET delete product
 */
router.get("/delete-product/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Products.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin_products/");
  });
});

module.exports = router;
