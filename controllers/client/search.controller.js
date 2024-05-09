const Product = require("../../models/product.model")

const productsHelper = require("../../helpers/product")

// [GET] /
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword

    let newProducts = []

    if(keyword) {

        const keywordRegex = new RegExp(keyword, "i")

        const products = await Product.find({
            title: keywordRegex,
            status: "available",
            deleted: false
        })
        newProducts = productsHelper.priceNewProducts(products) 

    }


    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    });
    
}