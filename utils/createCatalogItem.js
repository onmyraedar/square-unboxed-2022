const { default: mongoose } = require("mongoose");
const CatalogItem = require("../models/catalogitem");

function createCatalogItem(itemdetails, dbVariations) {

  const dbModifierLists = [];
  
  if (itemdetails.modifierLists) {

    const modifierLists = itemdetails.modifierLists;;
  
    for (const modifierList of modifierLists) {
  
      const dbModifiers = [];
      
      for (const modifier of modifierList.modifiers) {
  
        const dbModifierRecipe = [];
  
        for (const item of modifier.recipe) {
          // Convert string to ObjectID
          const inventoryItemID = mongoose.Types.ObjectId(item.inventoryItemID);
  
          dbModifierRecipe.push({
            ingredient: inventoryItemID,
            quantity: item.quantity,
          });
        }
  
        console.log(dbModifierRecipe);

        const dbModifier = {
          catalog_object_id: modifier.catalogObjectID,
          name: modifier.name,
          recipe: dbModifierRecipe,
        };
        dbModifiers.push(dbModifier);
  
      }
      
      console.log(dbModifiers);
  
      const dbModifierList = {
        catalog_object_id: modifierList.catalogObjectID,
        name: modifierList.name,
        modifiers: dbModifiers,
      };
  
      dbModifierLists.push(dbModifierList);
      /* console.log(dbModifierList);*/
    }

  }

  const catalogItem = new CatalogItem({
    catalog_object_id: itemdetails.catalogObjectID,
    name: itemdetails.name,
    modifier_lists: dbModifierLists,
    variations: dbVariations,
  })

  console.log(catalogItem);

  catalogItem.save(function (error) {
    if (error) {
      console.log("There was an error");
      return next(error);
    } else {
      console.log("There was no error");
    }
  });

  return catalogItem;
}

module.exports = ("createCatalogItem", createCatalogItem);