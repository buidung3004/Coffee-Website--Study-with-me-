const Order = require("../../models/order.model")
const User = require("../../models/user.model")
// [GET] admin/products

const paginationHelper = require("../../helpers/pagination")

module.exports.index = async (req,res) => {
  try {
    let find = {
        deleted: false
    };
    // Pagination
    const countOrders = await Order.countDocuments(find);

    let objectPagination = paginationHelper(
        {
        currentPage: 1,
        limitItems: 8
        },
        req.query,
        countOrders
    )

    const orders = await Order.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)

    // Lặp qua từng đơn hàng và tìm tên người dùng
    for (let order of orders) {
        const user = await User.findById(order.user_id);
        // console.log(user)
        if (user) {
            order.userFullName = user.fullName;
        } else {
            order.userFullName = 'Unknown User';
        }
              // Tính tổng tiền của đơn hàng
        order.totalPrice = order.products.reduce((total, product) => {
          const discount = product.price * (product.discountPercentage / 100);
          const finalPrice = product.price - discount;
          return total + (finalPrice * product.quantity);
      }, 0);
    }

  

    res.render("admin/pages/orders/index", {
        pageTitle: "Danh sách đơn hàng",
        orders: orders,
        pagination: objectPagination
    });
} catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal Server Error");
}
}

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

    console.log("Status:", status); // Kiểm tra giá trị của status
    console.log("Order ID:", orderId); // Kiểm tra giá trị của id

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
