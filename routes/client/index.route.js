const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route")

const searchRoutes = require("./search.route");
const checkoutRoutes = require("./checkout.route")
const userRoutes = require("./user.route")
const paypalRoutes = require("./paypal.route")
const vnpayRoutes = require("./vnpay.route")
const commentRoutes = require("./comment.route")

const settingMiddleware = require("../../middlewares/client/setting.middleware")
const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")
module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.infoUser)
    app.use(settingMiddleware.settingGeneral)

    app.use("/",homeRoutes);
    app.use("/products",productRoutes);


    app.use("/search", searchRoutes)
    app.use("/cart", cartRoutes)
    app.use("/checkout", checkoutRoutes)
    app.use("/user", userRoutes)
    app.use("/",paypalRoutes)
    app.use("/",vnpayRoutes)
    app.use("/comment",commentRoutes)
}