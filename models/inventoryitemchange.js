const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InventoryItemChangeSchema = new Schema({
    type: { type: String, required: true },
    inventory_item: { type: Schema.Types.ObjectId, ref: "InventoryItem" },
    line_item: { type: String },
    order: { type: String },
    reason: { type: String, required: true },
    quantity: { type: Schema.Types.Decimal128, default: 0 },
    quantity_in_stock: {
        before: { type: Schema.Types.Decimal128 },
        after: { type: Schema.Types.Decimal128 },
    }
});

module.exports = mongoose.model("InventoryItemChange", InventoryItemChangeSchema);