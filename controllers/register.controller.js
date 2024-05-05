const Joi = require('joi');
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username: username })
    .then(user => {
      if (!user || user.password !== password) {
        done(null, false, { message: 'Credentials are invalid.' });
      } else {
        done(null, user);
      }
    })
    .catch(done);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done);
});

exports.registerPage = (req, res) => {
  res.render("register", {
    title: "Register",
    csrfToken: req.csrfToken() // Add this line
  });
};

exports.register = async (req, res) => {
  // Validate the request data
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    // Add any other fields you want to validate here
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.render("register", {
      title: "Register",
      csrfToken: req.csrfToken(),
      registrationError: error.details[0].message
    });
  }

  // Check if the username is already in use
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.render("register", {
      title: "Register",
      csrfToken: req.csrfToken(),
      registrationError: 'Username already in use'
    });
  }

  // Save the user to the database
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    // Add any other fields you want to save here
  });

  await user.save();

  req.login(user, (loginError) => {
    if (loginError) {
      throw new Error('User was created but could not be logged in.');
    }
    res.send('Registration successful. Please log in.');
  });
};