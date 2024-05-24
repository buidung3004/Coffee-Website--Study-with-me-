const Cart =  require("../../models/cart.model")
const Product = require('../../models/product.model')
const Contact = require("../../models/contact.model")


const productsHelper = require("../../helpers/product") 

// [GET] /contact/
module.exports.index = async (req, res) => {
  res.render("client/pages/contact/index-test", {
    pageTitle: "Liên hệ",
  });

}

// [POST] /contact/add
module.exports.addPost = async(req,res) => {
  console.log(req.body)
  req.body.createdAt = new Date()

  const contact = new Contact(req.body)
  await contact.save()

  req.flash("success", "Send Message Successful !")

  res.redirect("back")
}
