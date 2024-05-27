const express = require("express");
const router = express.Router()

const controller = require("../../controllers/admin/contact.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);
// 
// router.post("/change-status", controller.updateOrderStatus);

router.delete("/delete/:id", controller.deleteItem);
// 
// router.post('/change-multi-status', controller.changeMultiStatus);
// 
router.get("/detail/:id", controller.detail);

router.post("/respond/:id", controller.respond)

module.exports = router