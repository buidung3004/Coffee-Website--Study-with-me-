const express = require("express");
const router = express.Router()

const controller = require("../../controllers/client/paypal.controller");

router.post("/api/paypal-transaction-complete", controller.paypalTransactionComplete)

module.exports = router