const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    terminal_event_type: { type: String, required: true },
    terminal_event_id: { type: String, required: true },
});

module.exports = mongoose.model("Order", OrderSchema);