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
      <h1>{activeCatalogItem.name}</h1>
      <h3>Modifiers</h3>
      {!activeCatalogItem.modifierLists.length && 
        <div>
          <p>This item has no modifiers.</p>
          <p>Press <b>Submit</b> to save your variation recipes.</p>
        </div>
      }
      {activeCatalogItem.modifierLists.map((modifierList) => 
        <div key={modifierList.catalogObjectID}>
          <b>{modifierList.name}</b>
          {modifierList.modifiers.map((modifier) => 
            <div key={modifier.catalogObjectID}>
              <p>{modifier.name}</p>
              {modifier.recipe.map((ingredient) => 
                  <div key={ingredient.ingredientID}>
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