const Product = require("../../models/product.model")

// [GET] /products
module.exports.index =  async (req, res) => {
    const products = await Product.find({
        status: "available",
        deleted: false
    });
    
    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100-item.discountPercentage)/100).toFixed(2)
        return item;
    })

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        newProducts: newProducts
    });
}