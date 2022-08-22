import React from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";

import "./AddVariationRecipeStep.css";

function AddVariationRecipeStep(props) {
  const {
    activeCatalogItem,
    handleAddIngredient,
    handleInventoryItemChange,
    handleQuantityChange,
    inventory,
    inventoryItemOptions
  } = props;

  /* 
  These functions control the Autocomplete components
  Each Autcomplete corresponds to one ingredient for one variation
  The user can change the value (inventory item) of the Autocomplete
  */

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

  function getQuantity(variationID, ingredientID) {
    const activeVariation = activeCatalogItem.variations.find(
      (variation) => variation.catalogObjectID === variationID
    );
    const activeIngredient = activeVariation.recipe.find(
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
      <h1>{activeCatalogItem.name} - Variations</h1> 
      {activeCatalogItem.variations.map((variation) => 
        <div key={variation.catalogObjectID}>
          <p>{variation.name}</p>
          {variation.recipe.map((ingredient) => 
            <div className="variation-ingredient" key={ingredient.ingredientID}>
              <Autocomplete 
                autoHighlight
                disablePortal
                id={`${variation.catalogObjectID}-${ingredient.ingredientID}-name`}
                isOptionEqualToValue={(option, value) => option.inventoryItemID === value.inventoryItemID}
                onChange={handleInventoryItemChange}
                options={inventoryItemOptions}
                renderInput={(params) => <TextField {...params} label="Choose an inventory item" variant="standard" />}
                style={{minWidth: 400}}
                value={getInventoryItem(ingredient.inventoryItemID)}
              />
              <TextField 
                id={`${variation.catalogObjectID}-${ingredient.ingredientID}-quantity`}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{getPluralUnit(ingredient.inventoryItemID)}</InputAdornment>,
                }}
                label="Enter a quantity"
                onChange={handleQuantityChange}
                type="number"
                variant="standard"
                value={getQuantity(variation.catalogObjectID, ingredient.ingredientID)}
              />
            </div>
          )}
          <Button onClick={handleAddIngredient} variant="outlined" value={variation.catalogObjectID}>
            Add Ingredient
          </Button>
        </div>
      )}      
    </div>
  );
}

export default AddVariationRecipeStep;