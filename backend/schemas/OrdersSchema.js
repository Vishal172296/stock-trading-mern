const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
    userId: { type: String, required: false },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: { type: String, required: true }, // BUY or SELL
    orderType: { type: String, default: "MARKET" }, // MARKET, LIMIT
    status: { type: String, default: "EXECUTED" }, // EXECUTED, CANCELLED
    createdAt: { type: Date, default: Date.now },
});

module.exports = { OrdersSchema };