const express = require("express");
const multer = require("multer");
const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/setting.controller");

const router = express.Router();

router.get("/general", controller.general);

router.patch(
    "/general",
    upload.fields([{ name: "logo" }]), // Sử dụng multer để xử lý file upload
    uploadCloud.upload, // Sử dụng middleware để upload lên Cloudinary
    controller.generalPatch
);

module.exports = router;
