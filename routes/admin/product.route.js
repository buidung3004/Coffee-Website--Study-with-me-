const express = require("express");
const multer = require("multer")
const router = express.Router()
const storageMulter = require("../../helpers/storageMulter")
const upload = multer({ storage: storageMulter() })

const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);
// thay đổi trạng thái sản phẩm
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create",controller.create)

router.post("/create", upload.single("thumbnail"), controller.createPost)

module.exports = router