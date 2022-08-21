const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    order_id: { type: String, required: true },
    created_at: { type: String, required: true },
    line_items: [{
        variation_catalog_object_id: { type: String, required: true },
        name: { type: String, required: true },
        variation_name: { type: String, required: true },
        quantity: { type: Schema.Types.Decimal128 },

        // Modifiers are not required: an item may not have any
        modifiers: [{
            catalog_object_id: { type: String },
            name: { type: String },
            quantity: { type: Schema.Types.Decimal128 },
        }],

        // Changes are not required: if an item has no recipe in the database,
        // there will be no need for a change
        inventory_item_changes: [{ type: Schema.Types.ObjectId, ref: "InventoryItemChange" }]
    }]
});

module.exports = mongoose.model("Order", OrderSchema);