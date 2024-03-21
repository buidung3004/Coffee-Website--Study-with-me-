const express = require("express");
const router = express.Router()

const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);
// thay đổi trạng thái sản phẩm
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router