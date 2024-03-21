const Product = require("../../models/product.model");

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

const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);


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
    res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "available":
            await Product.updateMany({_id:{$in: ids}}, { status:"available"} )
            break
        case "unavailable":
            await Product.updateMany({_id:{$in: ids}}, {status : "unavailable"})
            break
        default:
            break

    }
    res.redirect("back")

};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.deleteOne({_id:id})
    // cập nhật và tự chuyển hướng
    res.redirect("back");
};