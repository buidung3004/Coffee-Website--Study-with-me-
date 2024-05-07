const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // added username field
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  verificationCode: { type: Number },
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);