const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

productSchema.pre("save", function (next) {
    this.inStock = this.stockQuantity > 0;
    next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
