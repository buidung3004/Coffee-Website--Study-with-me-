const mongoose = require("mongoose");
const generate = require("../helpers/generate")

const confirmationUserSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 180
        },
        password: String,

      }, {
      timestamps: true
    }
);

const ConfirmationUser = mongoose.model("ConfirmationUser", confirmationUserSchema, "confirmation-users");


module.exports = ConfirmationUser;