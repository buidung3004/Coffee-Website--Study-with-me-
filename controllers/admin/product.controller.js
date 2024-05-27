const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model")
const Account = require('../../models/account.model')

const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTree = require("../../helpers/createTree")

// [GET] /admin/products
module.exports.index =  async(req, res) => {    
    // Code bộ lọc
    const filterStatus = filterStatusHelper(req.query);
    // tạo biến để lọc và tìm kiếm trong database
    let find = {
        deleted: false
    };
// gán url vào status, từ đó lọc và tìm kiếm các sản phẩm có status đó trong database
    if(req.query.status){
        find.status = req.query.status;
    }
// tìm kiếm    
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
        currentPage: 1,
        limitItems: 8
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



    const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

    for (const product of products) {
        // Lấy thông tin account tạo
        const userCreate = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if(userCreate) {
            product.accountFullName = userCreate.fullName
        }

        // Lấy thông tin acc sửa
        const updatedBy = product.updatedBy.slice(-1)[0]
        if(updatedBy) {
            const userUpdate = await Account.findOne({
                _id: updatedBy.account_id
            })
            updatedBy.accountFullName = userUpdate.fullName
        }

    }


    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date(),
    }

    await Product.updateOne({_id:id},{status:status,
        $push: { updatedBy: updatedBy}
    })
    // cập nhật và tự chuyển hướng
    req.flash("success","Cập nhật trạng thái thành công")
    res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date(),
    }

    switch (type) {
        case "available":
            await Product.updateMany({_id:{$in: ids}}, { status:"available", $push: { updatedBy: updatedBy}} )
            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm`)
            break
        case "unavailable":
            await Product.updateMany({_id:{$in: ids}}, {status : "unavailable", $push: { updatedBy: updatedBy}})
            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm`)
            break
        case "delete-all":
            const products = await Product.find({_id: {$in: ids}});
            let hasNaN = false;
        
            products.forEach(product => {
                if (isNaN(product.position)) {
                    hasNaN = true;
                    console.error(`Product with ID ${product._id} has NaN in position`);
                }
            });
        
            if (!hasNaN) {
                await Product.updateMany(
                    {_id: {$in: ids}}, 
                    {
                        deleted: true,
                        deletedBy: {
                            account_id: res.locals.user.id,
                            deletedAt: new Date(),
                        }
                    }
                );
                req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`);
            } else {
                req.flash("error", "Có sản phẩm với giá trị position không hợp lệ.");
            }
            break;
        

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({_id: id}, {position:position, $push: { updatedBy: updatedBy}})
                
            }
            req.flash("success",`Đã đổi vị trí thành công ${ids.length} sản phẩm`)
            break
        default:
            break

    }
    res.redirect("back")

};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id:id})
    await Product.updateOne({_id:id}, { 
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

// [GET] /admin/products/create

module.exports.create = async(req,res) => {
    let find = {
        deleted:false
    }
    const category = await ProductCategory.find(find)

    const newCategory = createTree.tree(category)

    res.render("admin/pages/products/create", {
        pageTitle:"Add new product",
        category:newCategory
    })
}

// [POST] /admin/products/create
module.exports.createPost = async(req,res) => {

    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
        account_id : res.locals.user.id,
    };

    // Handle additional images
    if (req.files) {
        req.body.additionalImage1 = req.files['additionalImage1'] ? req.files['additionalImage1'][0].path : '';
        req.body.additionalImage2 = req.files['additionalImage2'] ? req.files['additionalImage2'][0].path : '';
        req.body.additionalImage3 = req.files['additionalImage3'] ? req.files['additionalImage3'][0].path : '';
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async(req,res) => {
    try {
        const find = {
            deleted:false,
            _id: req.params.id
        }

        const product = await Product.findOne(find)
        
        const category = await ProductCategory.find({
            deleted:false
        })
    
        const newCategory = createTree.tree(category)
    
        res.render("admin/pages/products/edit", {
            pageTitle:"Edit product",
            product: product,
            category: newCategory
        })
    }
    catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}


// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async(req,res) => {
    const id = req.params.id;
    console.log(req.files);

    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    const currentProduct = await Product.findOne({_id: id});
    // Handle additional images
    req.body.additionalImage1 = req.body.additionalImage1 || currentProduct.additionalImage1;
    req.body.additionalImage2 = req.body.additionalImage2 || currentProduct.additionalImage2;
    req.body.additionalImage3 = req.body.additionalImage3 || currentProduct.additionalImage3;

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
        };

        // Retrieve the current product from the database
        const currentProduct = await Product.findOne({_id: id});

        // If no new file is uploaded, keep the current image path
        if (!req.body.additionalImage1) {
            req.body.additionalImage1 = currentProduct.additionalImage1;
        }
        if (!req.body.additionalImage2) {
            req.body.additionalImage2 = currentProduct.additionalImage2;
        }
        if (!req.body.additionalImage3) {
            req.body.additionalImage3 = currentProduct.additionalImage3;
        }

        await Product.updateOne({_id:id} ,{
            ...req.body,
            $push: { updatedBy: updatedBy}
        });

        // Retrieve the updated product from the database
        const updatedProduct = await Product.findOne({_id: id});

        // Check the additionalImage fields
        console.log(updatedProduct.additionalImage1);
        console.log(updatedProduct.additionalImage2);
        console.log(updatedProduct.additionalImage3);

        req.flash("success", "Cập nhật sản phẩm thành công  ");
    } catch (error) {
        req.flash("error", "Update fail");
    }

    res.redirect("back");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async(req,res) => {
    try {
        const find = {
            deleted:false,
            _id: req.params.id
        }

        const product = await Product.findOne(find)

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    }
    catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}