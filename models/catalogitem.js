const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CatalogItemSchema = new Schema({
    catalog_object_id: { type: String, required: true },
    name: { type: String, required: true },
    variations: [{ type: Schema.Types.ObjectId, ref: "CatalogItemVariation" }],
    modifier_lists: [{
        catalog_object_id: { type: String },
        name: { type: String },
        modifiers: [{
            catalog_object_id: { type: String },
            name: { type: String },
            recipe: [{
                ingredient: { type: Schema.Types.ObjectId, ref: "InventoryItem" },
                quantity: { type: Schema.Types.Decimal128, default: 0 }
            }]
        }]
    }]
});

module.exports = mongoose.model("CatalogItem", CatalogItemSchema);