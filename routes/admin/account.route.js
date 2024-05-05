const express = require("express");
const multer = require("multer")
const router = express.Router()

const upload = multer()
const controller = require("../../controllers/admin/account.controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const validate = require("../../validates/admin/account.validate");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create", 
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost);

module.exports = router
