const express = require("express");
const PORT = 5000;
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
//Routers
const postsAdminRouter = require("./routers/admin_posts");
const homeRouter = require("./routers/index");
const usersRouter = require("./routers/users");
const postsRouter = require("./routers/posts");
const managementAdminRouter = require("./routers/admin_management");
const departamentAdminRouter = require("./routers/admin_departaments");
const tendersAdminRouter = require("./routers/admin_tenders");
const tendersRouter = require("./routers/tenders");
const mainArticleAdminRouter = require("./routers/admin_mainArticle");
const articlesRouter = require("./routers/articles");
const managementRouter = require("./routers/management");
const departamentRouter = require("./routers/departaments");
const adminServicesRouter = require("./routers/admin_services");
const adminDescriptionRouter = require("./routers/admin_descriptionServices");
const DescriptionRouter = require("./routers/descriptionGet");
const ServicesRouter = require("./routers/services");

const path = require("path");
const mongoose = require("mongoose");
var passport = require("passport");
const fileUpload = require("express-fileupload");
const keys = require("./keys/index");
var expressValidator = require("express-validator");
const bodyParser = require("body-parser");
const Page = require("./models/page");
const app = express();

var cors = require("cors");
app.use(cors());

//mongo
mongoose
  .connect(keys.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

//EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use("/public", express.static("public"));

app.locals.errors = null;
app.use(expressLayouts);

// Get all pages to pass to header.ejs
Page.find({})
  .sort({ sorting: 1 })
  .exec(function (err, pages) {
    if (err) {
      console.log(err);
    } else {
      app.locals.pages = pages;
    }
  });

// Get Category Model
var Category = require("./models/category");

// Get all categories to pass to header.ejs
Category.find(function (err, categories) {
  if (err) {
    console.log(err);
  } else {
    app.locals.categories = categories;
  }
});

app.use(express.urlencoded({ extended: true }));

app.use(flash());

// Express fileUpload middleware
app.use(fileUpload());

// Body Parser middleware
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Express Validator middleware
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
    customValidators: {
      isImage: function (value, filename) {
        var extension = path.extname(filename).toLowerCase();
        switch (extension) {
          case ".jpg":
            return ".jpg";
          case ".jpeg":
            return ".jpeg";
          case ".png":
            return ".png";
          case "":
            return ".jpg";
          default:
            return false;
        }
      },
    },
  })
);

// Express Messages middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function (req, res, next) {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});

app.use("/", homeRouter);
app.use("/users", usersRouter);
app.use("/admin_posts", postsAdminRouter);
app.use("/posts", postsRouter);
app.use("/tenders", tendersRouter);
app.use("/admin_management", managementAdminRouter);
app.use("/admin_tenders", tendersAdminRouter);
app.use("/admin_departament", departamentAdminRouter);
app.use("/articles", articlesRouter);
app.use("/admin_article", mainArticleAdminRouter);
app.use("/management", managementRouter);
app.use("/departament", departamentRouter);
app.use("/admin_services", adminServicesRouter);
app.use("/admin_description", adminDescriptionRouter);
app.use("/description", DescriptionRouter);
app.use("/services", ServicesRouter);
app.listen(PORT);
