const express = require("express");
const router = express.Router()

const controller = require("../../controllers/client/vnpay.controller");

router.post('/create_payment_url', controller.vnpayCreatePayment)

router.get('/vnpay_return', controller.vnpayReturn)

module.exports = router