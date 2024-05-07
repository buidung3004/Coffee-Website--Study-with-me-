const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Joi = require('joi');

router.get('/verify', async (req, res) => {
  // Find the user
  const user = await User.findOne({ username: req.session.username });
  console.log(user.username, user.verificationCode);
  
  if (!user) {
    // Handle user not found
    return res.render("verify", {
      title: "Verify",
      csrfToken: req.csrfToken(),
      verificationError: 'User not found'
    });
  }

  res.render('verify', {
    title: 'Verify',
    csrfToken: req.csrfToken(),
    verificationCode: user.verificationCode // use the verification code from the user
  });
});

router.post('/verify', async (req, res) => {
  // Validate the request data
  const schema = Joi.object({
    verificationCode: Joi.number().required(),
    _csrf: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.render("verify", {
      title: "Verify",
      csrfToken: req.csrfToken(),
      verificationError: error.details[0].message
    });
  }

  // Find the user
  const user = await User.findOne({ username: req.session.username });
  if (!user) {
    // Handle user not found
    return res.render("verify", {
      title: "Verify",
      csrfToken: req.csrfToken(),
      verificationError: 'User not found'
    });
  }

  // Check if the entered verification code matches the one in the user
  if (Number(req.body.verificationCode) !== user.verificationCode) {
    return res.render("verify", {
      title: "Verify",
      csrfToken: req.csrfToken(),
      verificationError: 'Invalid verification code'
    });
  }

  // If the verification code is correct, mark the user as verified
  user.verified = true;
  await user.save();

  res.redirect('/login');
});

module.exports = router;