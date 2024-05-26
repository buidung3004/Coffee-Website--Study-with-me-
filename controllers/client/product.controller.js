const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const Comment = require("../../models/comment.model")


const paginationHelper = require("../../helpers/pagination")
const productsHelper = require("../../helpers/product") 
const productsCategoryHelper = require("../../helpers/products-category") 

// [GET] /products
module.exports.index =  async (req, res) => {


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


    // Sort
    let sort = {};

    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc"
    }
    

    const products = await Product.find({
        status: "available",
        deleted: false
    }).sort({position:"asc"}).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

    const newProducts = productsHelper.priceNewProducts(products)


    res.render("client/pages/products/index-test", {
        pageTitle: "Danh sách sản phẩm",
        newProducts: newProducts,
        pagination: objectPagination
    });

}

// [GET] /products/detail/:slug
module.exports.detail =  async (req, res) => {
    try {

        const find = {
            deleted:false,
            slug: req.params.slugProduct,
            status: "available"
        }

        const product = await Product.findOne(find)
        
        if(product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "available",
                deleted: false
            })
            product.category = category
        }

        product.priceNew = productsHelper.priceNewProduct(product)

        const category = await ProductCategory.findOne({
            _id: product.product_category_id
        })
        const listSubCategory = await productsCategoryHelper.getSubCategory(category.id)
    
        const listSubCategoryId = listSubCategory.map(item => item.id)

        const products = await Product.find({
            product_category_id: { $in:[category.id, ...listSubCategoryId ]},
            deleted: false,        
            status: "available",
        })

        const comments = await Comment.find({
            product_id: product._id.toString()
        })

        // console.log(comments)
        res.render("client/pages/products/detail-test", {
            pageTitle: product.title,
            product: product,
            products: products,
            comments:comments
        })
    } catch (error) {
        res.redirect(`/products`)
    }
}

// [GET] /products/:slugCategory

module.exports.category =  async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "available",
        deleted: false
    })
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

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id)
    
    const listSubCategoryId = listSubCategory.map(item => item.id)

    const products = await Product.find({
        product_category_id: { $in:[category.id, ...listSubCategoryId ]},
        deleted: false,        
        status: "available",
    }).sort({position: "desc"}).limit(objectPagination.limitItems).skip(objectPagination.skip);

    const newProducts = productsHelper.priceNewProducts(products)


    res.render("client/pages/products/index-test", {
        pageTitle: category.title,
        newProducts: newProducts,        
        pagination: objectPagination
    })
}

