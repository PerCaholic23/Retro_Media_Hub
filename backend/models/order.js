const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            seller: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            name: String,
            artist: String,
            price: Number,
            quantity: { type: Number, default: 1 },

            image: String
        }
    ],

    total: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["cod", "promptpay"],
        default: "promptpay"
    },

    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "completed"],
        default: "pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);