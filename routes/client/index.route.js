const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const loginRoute = require("../login.route");
const registerRoute = require("../registration.route");
module.exports = (app) => {
    app.use("/", homeRoutes);
    app.use("/products", productRoutes);
    app.use("/login", loginRoute);
    app.use("/register", registerRoute);
}