const mongoose = require("mongoose");

const CatalogItemVariation = require("../models/catalogitemvariation");

function catalogItemVariationCreate(variationdetails) {

  const recipe = [];
  for (const item of variationdetails.recipe) {
    // Convert string to ObjectID
    const inventoryItemID = mongoose.Types.ObjectId(item.inventoryItemID);

    recipe.push({
      ingredient: inventoryItemID,
      quantity: item.quantity,
    })
  }

  const catalogItemVariation = new CatalogItemVariation({
    catalog_object_id: variationdetails.catalogObjectID,
    name: variationdetails.name,
    recipe: recipe,
  })

  catalogItemVariation.save(function (error) {
    if (error) {
      console.log("There was an error");
      return next(error);
    } else {
      console.log("There was no error");
    }
  });

  return catalogItemVariation;
}

module.exports = ("catalogItemVariationCreate", catalogItemVariationCreate);