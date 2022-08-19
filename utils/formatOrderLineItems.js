function formatOrderLineItems(lineItems) {
  /* 
    This function puts line items into the format required by the 
    Square API to create an order. 
  */
  
  const squareOrderLineItems = [];
  for (const lineItem of lineItems) {
    const squareOrderLineItem = {
      quantity: "1",
      catalogObjectId: "",
    }
    const squareOrderLineItemModifiers = [];
    for (const lineItemComponent of lineItem) {
      if (lineItemComponent.type === "VARIATION") {
        squareOrderLineItem.catalogObjectId = lineItemComponent.catalogObjectID;
      } else if (lineItemComponent.type === "MODIFIER") {
        squareOrderLineItemModifiers.push({
          catalogObjectId: lineItemComponent.catalogObjectID,
        })
      }
    }
    if (squareOrderLineItemModifiers.length > 0) {
      squareOrderLineItem.modifiers = squareOrderLineItemModifiers;
    }
    squareOrderLineItems.push(squareOrderLineItem);
  }
  return squareOrderLineItems;
  
}

module.exports = ("formatOrderLineItems", formatOrderLineItems);