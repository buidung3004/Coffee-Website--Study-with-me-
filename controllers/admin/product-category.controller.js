const ProductCategory = require("../../models/product-category.model")

const systemConfig = require("../../config/system")
const createTree = require("../../helpers/createTree")

// [GET] /admin/products-category
module.exports.index =  async(req, res) => {   
    let find = {
        deleted: false
    };


    const records = await ProductCategory.find(find)

    const newRecords = createTree.tree(records)    

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    });
};

// [GET] /admin/products-category/create
module.exports.create =  async(req, res) => {    
    let find = {
        deleted: false
    }


    const records = await ProductCategory.find(find)  
    // console.log(records)
    const newRecords = createTree.tree(records)

    console.log(newRecords)
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục",
        records: newRecords
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
