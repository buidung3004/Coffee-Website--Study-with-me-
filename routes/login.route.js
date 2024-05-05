const express = require("express");
const router = express.Router();

const controller = require("../controllers/login.controller");

// GET route for /login
router.get("/login", controller.loginPage);

// POST route for /login
router.post("/login", controller.login);

module.exports = router;