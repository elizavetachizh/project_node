const express = require("express");
const router = express.Router();
const mainArticle = require("../models/mainArticles");

router.get("/", function (req, res) {
    mainArticle.find(function (err, articles) {
        res.render("articles", {
            articles: articles,
        });
        // res.send(tenders);
        console.log(articles);
    });
});
module.exports = router;
