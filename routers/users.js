const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];
  if (!name || !email || !password) {
    errors.push({ msg: "Пожалуйста, заполните все поля" });
  }

  // if (password !== passwordDouble) {
  //   errors.push({ msg: "Passwords do not match" });
  // }

  if (password.length < 6) {
    errors.push({ msg: "Пароль должен ьыть не менее 6 символов" });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.render("register", {
      errors,
      name,
      email,
      password,
    });
  } else {
    console.log(req.body);
    console.log(errors.length);
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email уже существует" });
        res.render("register", {
          errors,
          name,
          email,
          password,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "Вы зарегистированы и можете войти в систему"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  res.redirect("/home");
});

module.exports = router;
