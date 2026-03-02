const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  artist: String,
  description: String,
  category: String, // cd, vinyl, etc
  price: Number,
  stock: { type: Number, default: 0 },
  image: String, // for now store image URL or base64

  owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);