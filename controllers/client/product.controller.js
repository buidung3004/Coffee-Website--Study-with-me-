const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")

const productsHelper = require("../../helpers/product") 
const productsCategoryHelper = require("../../helpers/products-category") 

// [GET] /products
module.exports.index =  async (req, res) => {
    const products = await Product.find({
        status: "available",
        deleted: false
    }).sort({position:"asc"});

    const newProducts = productsHelper.priceNewProducts(products)

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        newProducts: newProducts
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

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
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


    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id)
    
    const listSubCategoryId = listSubCategory.map(item => item.id)

    const products = await Product.find({
        product_category_id: { $in:[category.id, ...listSubCategoryId ]},
        deleted: false
    }).sort({position: "desc"})

    const newProducts = productsHelper.priceNewProducts(products)

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        newProducts: newProducts
    });
}

