const passport = require('passport');

exports.loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};