const Order = require("../../models/order.model")
const User = require("../../models/user.model")
const Product = require("../../models/product.model")
// [GET] admin/products

const paginationHelper = require("../../helpers/pagination")

module.exports.index = async (req, res) => {
    try {
        let find = { deleted: false };

        const sortOption = req.query.sortCreatedAt || "desc";
        const sort = { createdAt: sortOption === "asc" ? 1 : -1 };

        const countOrders = await Order.countDocuments(find);

        let objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 8
            },
            req.query,
            countOrders
        );

        const orders = await Order.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip);

        for (let i = 0; i < orders.length; i++) {
            const user = await User.findById(orders[i].user_id);
            if (user) {
                orders[i].userInfo = {
                    fullName: user.fullName,
                    phone: user.phone,
                    address: user.address
                };
            }

            for (let j = 0; j < orders[i].products.length; j++) {
                const product = await Product.findById(orders[i].products[j].product_id);
                if (product) {
                    orders[i].products[j].product_name = product.title;
                }
            }

            orders[i].totalPrice = orders[i].products.reduce((total, product) => {
                const discount = product.price * (product.discountPercentage / 100);
                const finalPrice = product.price - discount;
                return total + (finalPrice * product.quantity);
            }, 0);
        }

        res.render("admin/pages/orders/index", {
            pageTitle: "Danh sách đơn hàng",
            orders: orders,
            pagination: objectPagination,
            sortCreatedAt: sortOption
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Internal Server Error");
    }
};

// [PATCH] /admin/orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const statusPayment = req.params.status;
    const id = req.params.id;


    // const updatedBy = {
    //     account_id: res.locals.user.id,
    //     updateAt: new Date(),
    // }

    await Order.updateOne({_id:id},{statusPayment:statusPayment,
        // $push: { updatedBy: updatedBy}
    })
    // cập nhật và tự chuyển hướng
    req.flash("success","Cập nhật trạng thái thành công")
    res.redirect("back");
};


module.exports.updateOrderStatus = async (req, res) => {
    const { status, orderId } = req.body;

    // console.log("Status:", status); // Kiểm tra giá trị của status
    // console.log("Order ID:", orderId); // Kiểm tra giá trị của id

    try {
        await Order.updateOne({ _id: orderId }, { status: status });
        req.flash("success","Cập nhật trạng thái thành công");
        res.redirect("back");
    } catch (error) {
        console.error(error);
        req.flash("error","Cập nhật trạng thái thất bại");
        res.redirect("back");
    }
};

// [DELETE] /admin/orders/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id:id})
    await Order.updateOne({_id:id}, { 
        deleted: true,
        // deletedBy: {
        //     account_id: res.locals.user.id,
        //     deletedAt: new Date(),
        // }
    })
    req.flash("success",`Đã xóa thành công sản phẩm`)
    // cập nhật và tự chuyển hướng
    res.redirect("back");
};

module.exports.changeMultiStatus = async (req, res) => {
    const { orderIds, newStatus, newPaymentStatus } = req.body;

    try {
        if (newStatus) {
            await Order.updateMany(
                { _id: { $in: orderIds } },
                { status: newStatus }
            );
        }

        if (newPaymentStatus) {
            await Order.updateMany(
                { _id: { $in: orderIds } },
                { statusPayment: newPaymentStatus }
            );
        }

        req.flash("success", "Cập nhật trạng thái thành công");
        res.redirect("back");
    } catch (error) {
        console.error(error);
        req.flash("error", "Cập nhật trạng thái thất bại");
        res.redirect("back");
    }
};

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const order = await Order.findOne(find);

        // Tính tổng tiền của đơn hàng và lấy tên sản phẩm
        for (let i = 0; i < order.products.length; i++) {
            const product = await Product.findById(order.products[i].product_id);
            if (product) {
                order.products[i].product_name = product.title;
                const discount = order.products[i].price * (order.products[i].discountPercentage / 100);
                const finalPrice = order.products[i].price - discount;
                order.products[i].finalPrice = finalPrice * order.products[i].quantity;
            }
        }

        order.totalPrice = order.products.reduce((total, product) => {
            return total + product.finalPrice;
        }, 0);

        res.render("admin/pages/orders/detail", {
            pageTitle: order._id,
            order: order
        });

    } catch (error) {
        console.error(error);
        res.redirect(`${systemConfig.prefixAdmin}/orders`);
    }
};