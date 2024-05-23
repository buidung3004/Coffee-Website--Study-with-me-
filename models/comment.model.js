const mongoose = require("mongoose");
const generate = require("../helpers/generate")

const commentSchema = new mongoose.Schema(
    {
      product_id: String,
      comment: String,
      userInfo: {
        fullName: String,
        email: String,
        phone: String,
        avatar: String
      },
      createdAt: String 
    }, {
        timestamps: true
    }
);

const Comment = mongoose.model("Comment", commentSchema, "comments");


module.exports = Comment;