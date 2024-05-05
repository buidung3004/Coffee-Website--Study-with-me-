const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register.controller');
const passport = require('passport');

// GET route for /register
router.get('/register', (req, res) => {
  // Render the 'register' view
  res.render('register', {
    title: 'Registration',
    registrationError: req.flash('registration-error'),
    registerFormExtraParams: {
      redirectUrl: req.query.ref ? config.get('routes.associationPath') + '?ref=' + req.query.ref : '/',
    },
    csrfToken: req.csrfToken(),
  });
});

router.post('/register', registerController.register, (req, res) => {
  res.send('Registration successful!');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: req.body.redirectUrl || '/',
    failureRedirect: req.get('Referrer') || '/',
    failureFlash: { type: 'login-error' },
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;