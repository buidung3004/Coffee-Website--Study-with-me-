const Contact = require("../../models/contact.model")
const sendMailHelper = require("../../helpers/sendMail")

module.exports.index = async (req,res) => {
  try {
    // Retrieve all users who are not deleted
    const contacts = await Contact.find({ deleted: false });

    // Render a view and pass the users data to it
    res.render("admin/pages/contacts/index", {
      pageTitle: "Danh sách khiếu nại",
      contacts: contacts
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

  await Contact.updateOne({_id:id},{status:status,
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
  await Contact.updateOne({_id:id}, { 
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

// [GET] /admin/products/detail/:id
module.exports.detail = async(req,res) => {
  try {
      const find = {
          deleted:false,
          _id: req.params.id
      }

      const contact = await Contact.findOne(find)

      res.render("admin/pages/contacts/detail", {
          pageTitle: contact.title,
          contact: contact
      })
  }
  catch (error) {
      res.redirect(`${systemConfig.prefixAdmin}/contacts`)
  }
}

module.exports.respond = async (req, res) => {
  try {
      contactId = req.params.id
      // Extract email and response message from request body
      email = req.body.email
      response = req.body.response
      user_name = req.body.name

      // Define the subject line for the email
      const subject = "Your Inquiry with Our Company";

      // Use a template string to create HTML content, embedding the user's response
      const html = `
          <html>
              <head>
                  <title>Response to Your Inquiry</title>
              </head>
              <body>
                  <p>Dear Customer,${user_name}</p>
                  <p>Thank you for your inquiry. Here is our response:</p>
                  <p>${response}</p>  <!-- Dynamically include the response here -->
                  <p>If you have any more questions, do not hesitate to contact us again.</p>
                  <p>Best Regards,<br>Your Company Team</p>
              </body>
          </html>
      `;

      // Send the email using the helper function
      await sendMailHelper.sendMail(email, subject, html);


      await Contact.updateOne({_id: contactId}, {status: "responsive"});
      // Respond to the client indicating that the email has been sent
      res.redirect('/admin/contacts');
  } catch (error) {
      console.error('Failed to send response email:', error);
      res.status(500).send({
          status: "error",
          message: "An error occurred while sending the response email."
      });
  }
};