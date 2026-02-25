const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },

  fullName: { type: String, required: true },
  address: { type: String, required: true },
  street: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  postalCode: { type: String, required: true },

  promptpayQR: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);