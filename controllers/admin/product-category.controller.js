const ProductCategory = require("../../models/product-category.model")

const systemConfig = require("../../config/system")


// [GET] /admin/products-category
module.exports.index =  async(req, res) => {   
    let find = {
        deleted: false
    };
    const records = await ProductCategory.find(find)
    

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: records
    });
};

// [GET] /admin/products-category/create
module.exports.create =  async(req, res) => {    
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục",
    });
};

// [POST] /admin/products/create
module.exports.createPost = async(req,res) => {
    if(req.body.position == "") {
        const countProductCategory = await ProductCategory.countDocuments();
        req.body.position = countProductCategory + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }
    const record = new ProductCategory(req.body)
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}
