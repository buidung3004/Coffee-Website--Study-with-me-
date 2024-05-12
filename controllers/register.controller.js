const Joi = require('joi');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');

exports.register = async (req, res) => {
  // Validate the request data
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    // Add any other fields you want to validate here
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if the email is already in use
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).send('Email already in use');
  }

  // Generate a 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // Save the user to the database
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    verificationCode: verificationCode,
    // Add any other fields you want to save here
  });

  await user.save();

  // Send the verification code to the user's email
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Email Verification Code',
    text: `Your verification code is ${verificationCode}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.send('Registration successful. Please check your email for the verification code.');
};