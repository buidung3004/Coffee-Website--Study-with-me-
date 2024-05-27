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