import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';

function OrderTest(props) {
  const { catalog } = props;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lineItem, setLineItem] = useState({
    catalogObjectID: "",
    name: "",
    variations: [],
    selectedVariation: {},
    modifierLists: [],
  });
  const [order, setOrder] = useState({
    lineItems: [],
    total: "",
  });

  let navigate = useNavigate();

  function getLineItemDetails(item) {
    const lineItemVariations = [];
    for (const variation of item.itemData.variations) {
      const lineItemVariation = {
        type: "VARIATION",
        catalogObjectID: variation.id,
        name: variation.itemVariationData.name,
        price: "",
        formattedPrice: "",
      }
      if (variation.itemVariationData.priceMoney) {
        lineItemVariation.price = variation.itemVariationData.priceMoney.amount;
      }
      lineItemVariation.formattedPrice = getFormattedPrice(lineItemVariation.price);
      lineItemVariations.push(lineItemVariation);
    }

    const lineItemModifierLists = [];
    if (item.itemData.modifierListInfo) {
      for (const modifierListDetails of item.itemData.modifierListInfo) {
        const modifierList = catalog.modifierLists.find(
          (list) => list.id === modifierListDetails.modifierListId
        );
        const lineItemModifierList = {
          catalogObjectID: modifierList.id,
          name: modifierList.modifierListData.name,
          modifiers: [],
        }

        const lineItemModifiers = [];
        for (const modifier of modifierList.modifierListData.modifiers) {
          const lineItemModifier = {
            type: "MODIFIER",
            catalogObjectID: modifier.id,
            name: modifier.modifierData.name,
            price: "",
            formattedPrice: "",
            isSelected: false,
          }
          if (modifier.modifierData.priceMoney) {
            lineItemModifier.price = modifier.modifierData.priceMoney.amount           
          }  
          lineItemModifier.formattedPrice = getFormattedPrice(lineItemModifier.price); 
          lineItemModifiers.push(lineItemModifier);        
        }
        lineItemModifierList.modifiers = lineItemModifiers;
        lineItemModifierLists.push(lineItemModifierList);
      }
    }

    const lineItemDetails = {
      catalogObjectID: item.id,
      name: item.itemData.name,
      variations: lineItemVariations,
      selectedVariation: lineItemVariations[0],
      modifierLists: lineItemModifierLists,
    }

    return lineItemDetails;

  }
  
  // Modal controls

  function handleClickOpen(item) {
    const lineItemDetails = getLineItemDetails(item);
    setLineItem(lineItemDetails);
    setIsDialogOpen(true);
  }

  function handleClose() {
    setIsDialogOpen(false);
  }

  function handleVariationChange(event) {
    const selectedVariation = lineItem.variations.find(
      (variation) => variation.catalogObjectID === event.target.value
    )
    setLineItem((lineItem) => {
      return {
       ...lineItem,
       selectedVariation: selectedVariation,
      }
     })
  }

  function handleModifierChange(modifierListID, modifierID) {
    const updatedModifierLists = lineItem.modifierLists.map(
      (modifierList) => {
        if (modifierList.catalogObjectID === modifierListID) {
          const updatedModifiers = modifierList.modifiers.map(
            (modifier) => {
              if (modifier.catalogObjectID === modifierID) {
                const updatedModifier = {...modifier, isSelected: !modifier.isSelected}
                return updatedModifier;
              } else {
                return modifier;
              }
            })
          return {...modifierList, modifiers: updatedModifiers};
        } else {
          return modifierList;
        }
      }
    )

    setLineItem((lineItem) => {
      return {
       ...lineItem,
       modifierLists: updatedModifierLists,
      }
     })
  }

  function handleAddLineItem() {
    const orderLineItem = [];
    const updatedVariation = {...lineItem.selectedVariation,
      name: `${lineItem.name} (${lineItem.selectedVariation.name})`}
    orderLineItem.push(updatedVariation);
    for (const modifierList of lineItem.modifierLists) {
      for (const modifier of modifierList.modifiers) {
        if (modifier.isSelected) {
          orderLineItem.push(modifier);
        }
      }
    }
    setOrder((order) => {
      return {
        ...order,
        lineItems: [...order.lineItems, orderLineItem],
        total: getOrderTotal([...order.lineItems, orderLineItem]),
      }
    });
    handleClose();
  }

  function getFormattedPrice(price) {
    const formattedPrice = new Intl.NumberFormat(
      "en", { style: "currency", currency: "USD" }).format(price / 100);
    return formattedPrice;
  }

  function getOrderTotal(lineItems) {
    let orderTotal = 0;
    for (const lineItem of lineItems) {
      for (const lineItemComponent of lineItem) {
        // If the component doesn't have an associated price
        // Just add 0 to the total
        orderTotal += (parseFloat(lineItemComponent.price) || 0);
      }
    }
    return getFormattedPrice(orderTotal);
  }

  async function handleCompleteOrder() {
    try {
      const response = await fetch("/order/create/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order)
      });
      console.log("Request successful!");
      console.log(response);
      navigate("/order/list");
    } catch (error) {
      console.log(error);
    }       
    
  }

  return(
    <div>
      <h1>Create test order</h1>
      {catalog.items.map((item) => 
      <div key={item.id}>
        <p>{item.itemData.name}</p>
        <Button onClick={() => handleClickOpen(item)} variant="outlined" value={item.id}>
          Add item to order
        </Button>
      </div>)}
      {lineItem.variations.length > 0 &&
      <Dialog 
        open={isDialogOpen}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle>Add item to order</DialogTitle>
        <DialogContent>
        <h3>{lineItem.name}</h3>
        <p>Select a variation.</p>
        <FormControl>
          <InputLabel id="variation-select-label">Variation</InputLabel>
          <Select
            label="Variation"
            labelId="variation-select-label"
            onChange={handleVariationChange}
            value={lineItem.selectedVariation.catalogObjectID}
          >
            {lineItem.variations.map((variation) => 
              <MenuItem value={`${variation.catalogObjectID}`}>
                {`${variation.name} ${variation.formattedPrice !== "$0.00"
                  ? "- " + variation.formattedPrice
                  : ""}
                `}
              </MenuItem>
            )}
          </Select>
        </FormControl> 
        {lineItem.modifierLists.map((modifierList) => 
          <div>
            <h3>{modifierList.name}</h3>
            <Stack direction="row" spacing={1}>
            {modifierList.modifiers.map((modifier) => 
              <Chip 
              color={modifier.isSelected ? "primary" : "default"}
              id={modifier.catalogObjectID}
              label={`${modifier.name} ${modifier.formattedPrice !== "$0.00"
                ? "+" + modifier.formattedPrice
                : ""}
              `}
              onClick={() => handleModifierChange(modifierList.catalogObjectID, modifier.catalogObjectID)} 
              />
            )}
            </Stack>
          </div>
        )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddLineItem}>Save Item</Button>
        </DialogActions>
      </Dialog>}
      {order.lineItems.length > 0 &&
      <div>
      {order.lineItems.map((orderLineItem) => 
        <div>
          {orderLineItem.map((orderLineItemComponent) => 
          <div>
            <p>{orderLineItemComponent.name}</p>
            <p>{orderLineItemComponent.formattedPrice}</p>
          </div>
          )}
        </div>
      )}
      <b>{order.total}</b>
      <Button onClick={handleCompleteOrder} variant="contained">
          Complete Order
      </Button>      
      </div>
      }
    </div>
  );
}

export default OrderTest;