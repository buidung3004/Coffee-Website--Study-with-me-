const User = require("../../models/user.model")

module.exports.index = async (req,res) => {
  try {
    // Retrieve all users who are not deleted
    const users = await User.find({ deleted: false });

    // Render a view and pass the users data to it
    res.render("admin/pages/users/index", {
      pageTitle: "Danh sách khách hàng",
      users: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  // const updatedBy = {
  //     account_id: res.locals.user.id,
  //     updateAt: new Date(),
  // }

  await User.updateOne({_id:id},{status:status,
      // $push: { updatedBy: updatedBy}
  })
  // cập nhật và tự chuyển hướng
  req.flash("success","Cập nhật trạng thái thành công")
  res.redirect("back");
};

// [DELETE] /admin/users/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({_id:id})
  await User.updateOne({_id:id}, { 
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