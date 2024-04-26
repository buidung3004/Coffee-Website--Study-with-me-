const express = require("express");
const multer = require("multer")

const router = express.Router()

const upload = multer()


const controller = require("../../controllers/admin/product.controller");

const validate = require("../../validates/admin/product.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get("/", controller.index);
// thay đổi trạng thái sản phẩm
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create",controller.create)

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
)

router.get("/edit/:id", controller.edit)

router.patch(
    "/edit/:id",
    uploadCloud.upload, 
    validate.createPost,
    controller.editPatch
)


router.get("/detail/:id", controller.detail)

module.exports = router