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


// [GET] /admin/products-category/edit
module.exports.edit =  async(req, res) => {    
    try {
        const id = req.params.id
    
        const data = await ProductCategory.findOne({
            _id:id,
            deleted: false
        })
        const records = await ProductCategory.find({
            deleted:false
        }) 
        const newRecords = createTree.tree(records)
    
        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chỉnh sửa danh mục",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
};


// [PATCH] /admin/products-category/edit
module.exports.editPatch =  async(req, res) => {    
    const id = req.params.id
    req.body.position = parseInt(req.body.position)
    try {
        await ProductCategory.updateOne({_id: id }, req.body)
        req.flash("success", "Update succesful")
    } catch (error) {
        req.flash("error", "Update fail")
    }

    res.redirect("back")
};

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id:id})
    await ProductCategory.updateOne({_id:id}, { 
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
        }
    })
    req.flash("success",`Đã xóa thành công sản phẩm`)
    // cập nhật và tự chuyển hướng
    res.redirect("back");
};