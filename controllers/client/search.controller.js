const Product = require("../../models/product.model")

const productsHelper = require("../../helpers/product")
const paginationHelper = require("../../helpers/pagination")
// [GET] /
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword

    let newProducts = []


    let find = {
        deleted: false
    };
    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
        currentPage: 1,
        limitItems: 6
        },
        req.query,
        countProducts
    )


    if(keyword) {
        // Sort
        let sort = {};

        if(req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue
        } else {
            sort.position = "desc"
        }
    

        const keywordRegex = new RegExp(keyword, "i")

        const products = await Product.find({
            title: keywordRegex,
            status: "available",
            deleted: false
        }).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

        
        newProducts = productsHelper.priceNewProducts(products)

    }



    res.render("client/pages/search/index-test", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        newProducts: newProducts,
        pagination: objectPagination
    });
    
}