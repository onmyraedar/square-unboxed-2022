const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InventoryItemChangeSchema = new Schema({
    type: { type: String, required: true },
    inventory_item: { type: Schema.Types.ObjectId, ref: "InventoryItem" },
    line_item: { type: String, required: true },
    order: { type: String, required: true },
    reason: { type: String, required: true },
    quantity: { type: Schema.Types.Decimal128, default: 0 }
});

module.exports = mongoose.model("InventoryItemChange", InventoryItemChangeSchema);