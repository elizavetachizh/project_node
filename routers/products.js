const express = require("express");
const router = express.Router();
const Products = require("../models/products");
const Category = require("../models/category");
const auth = require("../config/auth");
const isUser = auth.isUser;
router.get("/", isUser, function (req, res) {
  Products.find(function (err, products) {
    if (err) console.log(err);

    res.render("all_products", {
      title: products.title,
      products: products,
    });
  });
});

router.get("/:category", isUser, function (req, res) {
  const categorySlug = req.params.category;
  Category.findOne({ slug: categorySlug }, function (err, category) {
    Products.find({ category: categorySlug }, function (err, products) {
      if (err) console.log(err);

      res.render("category_products", {
        title: category.title,
        products: products,
      });
    });
  });
});

/*
 * GET product details
 */
router.get("/:category/:product", function (req, res) {
  var galleryImages = null;
  var loggedIn = !!req.isAuthenticated();
  console.log(loggedIn);
  Products.findOne({ slug: req.params.product }, function (err, product) {
    if (err) {
      console.log(err);
    } else {
      res.render("product", {
        title: product.title,
        p: product,
        galleryImages: galleryImages,
        loggedIn: loggedIn,
      });
    }
  });
});
module.exports = router;
