const express = require("express");
const PORT = 5000;
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
//Routers
const homeRouter = require("./routers/index");
const usersRouter = require("./routers/users");
const pageRouter = require("./routers/page");
const adminPageRouter = require("./routers/admin_pages");
const pagesRouter = require("./routers/pages");
const categoryRouter = require("./routers/admin_category");
const productsAdminRouter = require("./routers/admin_products");
const pageSlugRouter = require("./routers/pageSlug");
const productsRouter = require("./routers/products");
const cardRouter = require("./routers/createCard");
const path = require("path");
const mongoose = require("mongoose");
var passport = require('passport');
const app = express();
const MongoStore = require("connect-mongodb-session")(session);
const fileUpload = require("express-fileupload");
const keys = require("./keys/index");
var expressValidator = require("express-validator");
const bodyParser = require("body-parser");
const Page = require("./models/page");

//EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

app.use(expressLayouts);
app.locals.errors = null;

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(flash());

// Express fileUpload middleware
app.use(fileUpload());

// Body Parser middleware
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// app.use(expressValidator({}));
app.use("/public", express.static("public"));
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Body Parser middleware
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//mongo
mongoose
  .connect(keys.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// Express Messages middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

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

app.use("/", homeRouter);
app.use("/users", usersRouter);
app.use("/home", pageRouter);
app.use("/page", pageSlugRouter);
app.use("/admin_page", adminPageRouter);
app.use("/pages", pagesRouter);
app.use("/admin_category", categoryRouter);
app.use("/admin_products", productsAdminRouter);
app.use("/products", productsRouter);
app.use("/cart", cardRouter);

app.listen(PORT);