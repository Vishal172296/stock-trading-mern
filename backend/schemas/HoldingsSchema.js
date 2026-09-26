const { Schema } = require("mongoose");

const HoldingsSchema = new Schema({
    userId: { type: String, required: false },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    avg: { type: Number, required: true },
    price: { type: Number, required: true },
    net: { type: String, default: "0.00%" },
    day: { type: String, default: "0.00%" },
    isLoss: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = { HoldingsSchema };