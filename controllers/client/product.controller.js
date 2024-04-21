const Product = require("../../models/product.model")

// [GET] /products
module.exports.index =  async (req, res) => {
    const products = await Product.find({
        status: "available",
        deleted: false
    }).sort({position:"asc"});
    
    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100-item.discountPercentage)/100).toFixed(2)
        return item;
    })

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        newProducts: newProducts
    });
}

// [GET] /products/:slug

module.exports.detail =  async (req, res) => {
    try {
        const find = {
            deleted:false,
            slug: req.params.slug,
            status: "available"
        }

        const product = await Product.findOne(find)


        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`/products`)
    }
}
