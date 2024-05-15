const ProductCategory = require("../../models/product-category.model")
const Product = require("../../models/product.model")
const Account = require("../../models/account.model")
const User = require("../../models/user.model")

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            available: 0,
            unavailable: 0,
        },
        product: {
            total: 0,
            available: 0,
            unavailable: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    }
    statistic.categoryProduct.total = await ProductCategory.countDocuments({
        deleted: false
    })
    statistic.categoryProduct.available = await ProductCategory.countDocuments({
        deleted: false,
        status: "available"
    })
    statistic.categoryProduct.unavailable = await ProductCategory.countDocuments({
        deleted: false,
        status: "unavailable"
    })
    statistic.product.total = await Product.countDocuments({
        deleted: false
    })
    statistic.product.available = await Product.countDocuments({
        deleted: false,
        status: "available"
    })
    statistic.product.unavailable = await Product.countDocuments({
        deleted: false,
        status: "unavailable"
    })
    statistic.account.total = await Account.countDocuments({
        deleted: false
    })
    statistic.account.active = await Account.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.account.inactive = await Account.countDocuments({
        deleted: false,
        status: "inactive"
    })
    statistic.user.total = await User.countDocuments({
        deleted: false
    })
    statistic.user.active = await User.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.user.inactive = await User.countDocuments({
        deleted: false,
        status: "inactive"
    })

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    });
}