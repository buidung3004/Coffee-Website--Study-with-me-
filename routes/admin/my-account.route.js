const express = require("express");
const multer = require("multer")

const router = express.Router()
const upload = multer()

const controller = require("../../controllers/admin/my-account.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const validate = require("../../validates/admin/account.validate");

router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch(
    "/edit",
    upload.single("avatar"),
    uploadCloud.upload,
    controller.editPatch
);

module.exports = router
