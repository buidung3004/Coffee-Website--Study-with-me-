const express = require("express");
const router = express.Router()

const controller = require("../../controllers/client/comment.controller")


router.post("/add/:productId", controller.addPost)

module.exports = router