const mongoose = require("mongoose");

const Order = require("../models/order");

function createOrder(orderdetails) {
  
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

    dbLineItems.push({
      variation_catalog_object_id: lineItem.catalogObjectId,
      name: lineItem.name,
      variation_name: lineItem.variationName,
      quantity: lineItem.quantity,
      modifiers: dbModifiers,
      inventory_item_changes: [],
    })
  }
  
  const order = new Order({
    order_id: orderdetails.id,
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