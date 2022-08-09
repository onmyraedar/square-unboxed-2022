const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InventoryItemSchema = new Schema({
    name: { type: String, required: true },
    quantity_in_stock: { type: Schema.Types.Decimal128, required: true, default: 0 },
    unit: {
        singular: { type: String, required: true },
        plural: { type: String, required: true }
    }
});

module.exports = mongoose.model("InventoryItem", InventoryItemSchema);