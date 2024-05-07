const Joi = require('joi');
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'Credentials are invalid.' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }

        if (!isMatch) {
          return done(null, false, { message: 'Credentials are invalid.' });
        }

        return done(null, user);
      });
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
    csrfToken: req.csrfToken()
  });
};

exports.register = async (req, res) => {
  // Validate the request data
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    email: Joi.string().email().required(),
    _csrf: Joi.string().required(),
  });

  // Check if the email is already in use
  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) {
    return res.render("register", {
      title: "Register",
      csrfToken: req.csrfToken(),
      registrationError: 'Email already in use'
    });
  }

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

  // Hash the password before saving the user
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  // Generate a numeric verification code
  const verificationCode = Math.floor(Math.random() * 1000000); // generates a six-digit number

  console.log(verificationCode);

  // Save the user to the database
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    verificationCode: verificationCode // save the verification code to the user
  });

  await user.save();
  console.log(user.verificationCode);

  // Set the username in the session and save the session
  req.session.username = req.body.username;
  req.session.save(err => {
    if(err) {
      console.log(err); // log the error if there is one
    }

    // Redirect the user to the verification page
    res.redirect('/verify');
  });
};