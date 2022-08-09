const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CatalogItemVariationSchema = new Schema({
    catalog_object_id: { type: String, required: true },
    name: { type: String, required: true },
    recipe: [{
        ingredient: { type: Schema.Types.ObjectId, ref: "InventoryItem" },
        quantity: { type: Schema.Types.Decimal128, default: 0 }
    }]
})

module.exports = mongoose.model("CatalogItemVariation", CatalogItemVariationSchema);