const mongoose = require("mongoose");

const getDeductionQuantity = require("./getDeductionQuantity");

const CatalogItem = require("../models/catalogitem");
const CatalogItemVariation = require("../models/catalogitemvariation");
const InventoryItem = require("../models/inventoryitem");
const InventoryItemChange = require("../models/inventoryitemchange");
const Order = require("../models/order");

async function createOrder(orderdetails) {
  
  const dbLineItems = [];

  for (const lineItem of orderdetails.lineItems) {

    console.log(lineItem);

    const dbModifiers = [];

    if (lineItem.modifiers) {
      for (const modifier of lineItem.modifiers) {
        console.log(modifier);
        dbModifiers.push({
          catalog_object_id: modifier.catalogObjectId,
          name: modifier.name,
          quantity: modifier.quantity,
        })
      }
    }

    const catalogItemVariation = await CatalogItemVariation.findOne({
      catalog_object_id: lineItem.catalogObjectId
    });

    console.log(catalogItemVariation);

    const dbInventoryItemChanges = [];

    if (catalogItemVariation) {
      const catalogItem = await CatalogItem.findOne(
        {variations: { $in: catalogItemVariation._id }})
      .populate({path: "variations",
        populate: { path: "recipe.ingredient" }
      })
      .populate("modifier_lists.modifiers.recipe.ingredient")

      for (const variation of catalogItem.variations) {
        if (variation.catalog_object_id === lineItem.catalogObjectId) {
          for (const item of variation.recipe) {                                
            const deductionQuantity = getDeductionQuantity(
              item.ingredient.quantity_in_stock, item.quantity
            )

            const quantityInStock = parseFloat(item.ingredient.quantity_in_stock.toString());
            const quantityBefore = quantityInStock;
            const quantityAfter = quantityInStock - deductionQuantity;  
            
            const inventoryItemChange = new InventoryItemChange({
              type: "DEDUCTION",
              inventory_item: item.ingredient._id,
              line_item: lineItem.catalogObjectId,
              order: orderdetails.id,
              reason: `${lineItem.name} (${lineItem.variationName})`,
              quantity: deductionQuantity,
              quantity_in_stock: {
                before: quantityBefore,
                after: quantityAfter,
              }
            });
            await inventoryItemChange.save();
            dbInventoryItemChanges.push(inventoryItemChange);           
          }
        }
      }

      if (lineItem.modifiers) {
        for (const lineItemModifier of lineItem.modifiers) {
          for (const modifierList of catalogItem.modifier_lists) {
            const appliedModifier = modifierList.modifiers.find(
              (modifier) => modifier.catalog_object_id === lineItemModifier.catalogObjectId
            )
            if (appliedModifier) {
              for (const item of appliedModifier.recipe) {
                const deductionQuantity = getDeductionQuantity(
                    item.ingredient.quantity_in_stock, item.quantity
                )
                const quantityInStock = parseFloat(item.ingredient.quantity_in_stock.toString());
                const quantityBefore = quantityInStock;
                const quantityAfter = quantityInStock - deductionQuantity;  
  
                const inventoryItemChange = new InventoryItemChange({
                  type: "DEDUCTION",
                  inventory_item: item.ingredient._id,
                  order: orderdetails.id,
                  line_item: lineItem.catalogObjectId,
                  reason: `Modifier: ${lineItemModifier.name}`,
                  quantity: deductionQuantity,
                  quantity_in_stock: {
                    before: quantityBefore,
                    after: quantityAfter,
                  }
                });
                await inventoryItemChange.save();   
                dbInventoryItemChanges.push(inventoryItemChange);           
              }
            }        
          }
        }  
      }    
    } 

    console.log(dbInventoryItemChanges);

    for (const change of dbInventoryItemChanges) {
      const inventoryItem = await InventoryItem.findByIdAndUpdate(
        change.inventory_item, { $inc: { quantity_in_stock: -change.quantity } }
      )
    }
    
    dbLineItems.push({
      variation_catalog_object_id: lineItem.catalogObjectId,
      name: lineItem.name,
      variation_name: lineItem.variationName,
      quantity: lineItem.quantity,
      modifiers: dbModifiers,
      inventory_item_changes: dbInventoryItemChanges,
    })
  }

  const order = new Order({
    order_id: orderdetails.id,
    created_at: orderdetails.createdAt,
    line_items: dbLineItems,
  })

  order.save(function (error) {
    if (error) {
      console.log(error);
      console.log("There was an error");
      return next(error);
    } else {
      console.log("There was no error");
    }
  });  

  return order;

}

module.exports = ("createOrder", createOrder);