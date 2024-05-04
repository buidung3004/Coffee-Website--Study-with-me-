const express = require("express");
const router = express.Router();
const registerController = require('../controllers/register.controller');

// GET route for /register
router.get('/register', (req, res) => {
  // Render the 'register' view
  res.render('client/pages/register');
});

router.post('/register', registerController.register);

module.exports = router;