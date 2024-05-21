const systemConfig = require("../../config/system")
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route"); 
const productCategoryRoutes = require("./product-category.route")
const roleRoutes = require("./role.route")
const accountRoutes = require("./account.route")
const authRoutes = require("./auth.route")
const myAccountRoutes = require("./my-account.route")
const settingRoutes = require("./setting.route")
const powerbiRoutes = require("./powerbi.route")

const authMiddleware = require("../../middlewares/admin/auth.middleware")
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(
        PATH_ADMIN + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoutes
    );

    app.use(
        PATH_ADMIN + "/products",
        authMiddleware.requireAuth,
        productRoutes
    )
    app.use(
        PATH_ADMIN + "/products-category",
        authMiddleware.requireAuth,
        productCategoryRoutes
    )
    app.use(
        PATH_ADMIN + "/roles",
        authMiddleware.requireAuth,
        roleRoutes
    )
    app.use(
        PATH_ADMIN + "/accounts",
        authMiddleware.requireAuth,
        accountRoutes
    )
    app.use(PATH_ADMIN + "/auth", authRoutes)
    app.use(
        PATH_ADMIN + "/my-account",
        authMiddleware.requireAuth,
        myAccountRoutes
    )

    app.use(PATH_ADMIN + "/settings", 
        authMiddleware.requireAuth,
        settingRoutes
    )

    app.use(
        PATH_ADMIN + "/powerbi",
        authMiddleware.requireAuth,
        powerbiRoutes
    )
}