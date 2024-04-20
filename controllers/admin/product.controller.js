const Product = require("../../models/product.model");

const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")

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
    limitItems: 4
    },
    req.query,
    countProducts
)

const products = await Product.find(find).sort({position: "asc"}).limit(objectPagination.limitItems).skip(objectPagination.skip);


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

    await Product.updateOne({_id:id},{status:status})
    // cập nhật và tự chuyển hướng
    req.flash("success","Cập nhật trạng thái thành công")
    res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "available":
            await Product.updateMany({_id:{$in: ids}}, { status:"available"} )
            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm`)
            break
        case "unavailable":
            await Product.updateMany({_id:{$in: ids}}, {status : "unavailable"})
            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm`)
            break
        case "delete-all":
            await Product.updateMany(
                {_id:{$in: ids}}, 
                {
                    deleted: true,
                    deletedAt: new Date()
                })
            req.flash("success",`Đã xóa thành công ${ids.length} sản phẩm`)
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({_id: id}, {position:position})
                
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
        deletedAt: new Date()
    })
    req.flash("success",`Đã xóa thành công sản phẩm`)
    // cập nhật và tự chuyển hướng
    res.redirect("back");
};

// [GET] /admin/products/create

module.exports.create = async(req,res) => {
    res.render("admin/pages/products/create", {
        pageTitle:"Add new product",
    })
}

// [POST] /admin/products/create
module.exports.createPost = async(req,res) => {

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if(req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    const product = new Product(req.body)
    await product.save()

    res.redirect(`${systemConfig.prefixAdmin}/products`)
}