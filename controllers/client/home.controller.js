const Product =  require("../../models/product.model")

const productsHelper = require("../../helpers/product") 

// [GET] /
module.exports.index = async (req, res) => {
    // Lấy sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "available"
    }).limit(6)
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)

    // Lấy sản phẩm nổi bật
    const productsNew = await Product.find({
        deleted: false,
        status: "available"
    }).sort({position:"desc"}).limit(6)

    const newProductsNew = productsHelper.priceNewProducts(productsNew)

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}