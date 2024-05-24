const mongoose = require("mongoose");
const generate = require("../helpers/generate")

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String ,
    message: String,
    createdAt: {
      type: Date, 
      default: Date.now
    }  
  },{
    timestamps: true
  }
);

const Contact = mongoose.model("Contact", contactSchema, "contacts");


module.exports = Contact;