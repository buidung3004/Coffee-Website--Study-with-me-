const passport = require('passport');

exports.loginPage = (req, res) => {
  res.render("login", {
    pageTitle: "Login",
    csrfToken: req.csrfToken()
  });
};

exports.login = (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      return res.render("login", {
        pageTitle: "Login",
        csrfToken: req.csrfToken(),
        loginError: info.message
      });
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); 
      }
      return res.redirect('/');
    });
  })(req, res, next);
};