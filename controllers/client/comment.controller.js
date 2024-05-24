const Comment = require("../../models/comment.model")
const Product = require("../../models/product.model")
const User = require("../../models/user.model")

// [POST] /comment/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId
  // console.log(productId)
  const comment_text = req.body.comment

  // console.log(productId)
  // console.log(comment)
  // console.log(res.locals.user)
  const createdAt =  Date.now()
  const date = new Date(createdAt)
  // Định nghĩa mảng các tháng
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Lấy các thành phần ngày, tháng, năm
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const formattedDate = `${month} ${day}, ${year}`;
  console.log(formattedDate)
  objectComment = {
    product_id: productId,
    comment: comment_text,
    userInfo: {
      fullName: res.locals.user.fullName,
      email: res.locals.user.email,
      avatar: res.locals.user.avatar
    },
    createdAt: formattedDate
  }
  const comment = new Comment(objectComment)
  await comment.save()

  req.flash("success", "Thank you for your contributions")

  res.redirect("back")


}
