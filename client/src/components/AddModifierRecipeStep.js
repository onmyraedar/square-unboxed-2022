import React from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";

function AddModifierRecipeStep(props) {
  const { 
    activeCatalogItem,
    handleAddModifierIngredient,
    handleModifierInventoryItemChange,
    handleModifierQuantityChange,
    inventory,
    inventoryItemOptions
  } = props;

  function getInventoryItem(inventoryItemID) {
    const inventoryItem = inventoryItemOptions.find(
      (item) => item.inventoryItemID === inventoryItemID
    );
    console.log(inventoryItemID);
    if (inventoryItem) {
      return inventoryItem;
    } else {
      return null;
    }
  }
  function getQuantity(modifierID, ingredientID) {
    const activeModifierList = activeCatalogItem.modifierLists.find(
      (modifierList) => modifierList.modifiers.find(
        (modifier) => modifier.catalogObjectID === modifierID
      ));
    const activeModifier = activeModifierList.modifiers.find(
      (modifier) => modifier.catalogObjectID === modifierID
    );     
    const activeIngredient = activeModifier.recipe.find(
      (ingredient) => ingredient.ingredientID === ingredientID
    );     
    console.log("Modifier:");
    console.log(activeIngredient);
    return activeIngredient.quantity;
  }  

  function getPluralUnit(inventoryItemID) {
    const activeIngredient = inventory.find(
      (item) => item._id === inventoryItemID
    );
    if (activeIngredient) {
      return activeIngredient.unit.plural;
    } else {
      return "";
    }
  }  

  return(
    <div>
      {activeCatalogItem.modifierLists.map((modifierList) => 
        <div>
          <b>{modifierList.name}</b>
          {modifierList.modifiers.map((modifier) => 
            <div>
              <p>{modifier.name}</p>
              {modifier.recipe.map((ingredient) => 
                  <div>
                    <Autocomplete 
                      autoHighlight
                      disablePortal
                      id={`${modifier.catalogObjectID}-${ingredient.ingredientID}-name`}
                      isOptionEqualToValue={(option, value) => option.inventoryItemID === value.inventoryItemID}
                      onChange={handleModifierInventoryItemChange}
                      options={inventoryItemOptions}
                      renderInput={(params) => <TextField {...params} label="Choose an inventory item" />}
                      value={getInventoryItem(ingredient.inventoryItemID)}
                    />
                    <TextField 
                      id={`${modifier.catalogObjectID}-${ingredient.ingredientID}-quantity`}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">{getPluralUnit(ingredient.inventoryItemID)}</InputAdornment>,
                      }}
                      label="Enter a quantity"
                      onChange={handleModifierQuantityChange}
                      type="number"
                      variant="outlined"
                      value={getQuantity(modifier.catalogObjectID, ingredient.ingredientID)}
                    />                    
                  </div>
              )}
              <Button onClick={handleAddModifierIngredient} variant="outlined" value={modifier.catalogObjectID}>
                Add Ingredient
              </Button>
            </div>
          )}
        </div>
      )}
    </div>   
  );
}

export default AddModifierRecipeStep;