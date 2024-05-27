const mongoose = require("mongoose");
const generate = require("../helpers/generate")

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String ,
    message: String,
    status: {
      type: String,
      default: "unresponsive"
    },
    createdAt: {
      type: Date, 
      default: Date.now
    } ,
    deleted: {
      type: Boolean,
      default: false
    }, 
  },{
    timestamps: true
  }
);

const Contact = mongoose.model("Contact", contactSchema, "contacts");


module.exports = Contact;