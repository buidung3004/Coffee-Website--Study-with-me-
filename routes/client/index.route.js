const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route")

const searchRoutes = require("./search.route");
const checkoutRoutes = require("./checkout.route")
const userRoutes = require("./user.route")


const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)

    app.use("/",homeRoutes);
    app.use("/products",productRoutes);


    app.use("/search", searchRoutes)
    app.use("/cart", cartRoutes)
    app.use("/checkout", checkoutRoutes)
    app.use("/user", userRoutes)
}