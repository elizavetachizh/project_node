var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {

    passport.use(new LocalStrategy(function (email, password, done) {

        User.findOne({email: email}, function (err, user) {
            if (err)
                console.log(err);

            if (!user) {
                return done(null, false, {message: 'Пользователь не был найден!'});
            }

            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err)
                    console.log(err);

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Пароль неверный.'});
                }
            });
        });

    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}