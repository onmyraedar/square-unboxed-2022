import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import uniqid from "uniqid";

function CreateRecipeForm(props) {

  const { catalog, inventory } = props;

  const [activeCatalogItem, setActiveCatalogItem] = useState({
    catalogObjectID: "",
    name: "",
    variations: [],
  });

  function handleCatalogItemChange(event, value) {

    console.log(value.label);
    const item = catalog.items.find((item) => item.id === value.catalogObjectID);
    const variations = item.itemData.variations;
    
    // Create a new object with blank recipe for each item variation
    const activeCatalogItemVariations = [];
    for (const variation of variations) {
        activeCatalogItemVariations.push({
        catalogObjectID: variation.id,
        name: variation.itemVariationData.name,
        recipe: [],
        });
    }

    setActiveCatalogItem((activeCatalogItem) => {
        return {
        ...activeCatalogItem,
        catalogObjectID: value.catalogObjectID,
        name: value.label,
        variations: activeCatalogItemVariations,
        }
    });
  }  
  
  function handleInventoryItemChange(event, value) {

    const parsedID = event.target.id.split("-");
    const activeVariationID = parsedID[0];
    const activeIngredientID = parsedID[1];

    const updatedVariations = activeCatalogItem.variations.map(
      (variation) => {
        if (variation.catalogObjectID === activeVariationID) {
          const updatedRecipe = variation.recipe.map(
            (ingredient) => ingredient.ingredientID === activeIngredientID 
            ? {...ingredient, inventoryItemID: value.inventoryItemID, name: value.label}
            : ingredient
          );
          console.log("Updated recipe:");
          console.log(updatedRecipe);
          return {...variation, recipe: updatedRecipe};
        } else {
          return variation;
        }
      }
    );

    setActiveCatalogItem((activeCatalogItem) => {
      return {
        ...activeCatalogItem,
        variations: updatedVariations,
      }
    });    
  }
  
  function handleQuantityChange(event, value) {

    const parsedID = event.target.id.split("-");
    const activeVariationID = parsedID[0];
    const activeIngredientID = parsedID[1];

    const updatedVariations = activeCatalogItem.variations.map(
      (variation) => {
        if (variation.catalogObjectID === activeVariationID) {
          const updatedRecipe = variation.recipe.map(
            (ingredient) => ingredient.ingredientID === activeIngredientID 
            ? {...ingredient, quantity: event.target.value}
            : ingredient
          );
          console.log("Updated recipe:");
          console.log(updatedRecipe);
          return {...variation, recipe: updatedRecipe};
        } else {
          return variation;
        }
      }
    );

    setActiveCatalogItem((activeCatalogItem) => {
      return {
        ...activeCatalogItem,
        variations: updatedVariations,
      }
    });    
  }

  function handleAddIngredientClick(event) {

    const activeVariationID = event.target.value;

    const updatedVariations = activeCatalogItem.variations.map(
      (variation) => {
        if (variation.catalogObjectID === activeVariationID) {
          const updatedRecipe = [...variation.recipe, {
            ingredientID: uniqid(),
            inventoryItemID: "PlaceholderID",
            name: "Placeholder",
            quantity: 0,            
          }];
          console.log(updatedRecipe);
          return {...variation, recipe: updatedRecipe};
        } else {
          return variation;
        }
      }
    );

    setActiveCatalogItem((activeCatalogItem) => {
      return {
        ...activeCatalogItem,
        variations: updatedVariations,
      }
    });
  }

  const catalogItemOptions = catalog.items.map(
    (item) => ({ label: item.itemData.name, catalogObjectID: item.id })
  )
  const inventoryItemOptions = inventory.map(
    (item) => ({ label: item.name, inventoryItemID: item._id })
  )

  return (
    <div>
      <Autocomplete 
        autoHighlight
        disablePortal
        id="catalog-item-autocomplete"
        isOptionEqualToValue={(option, value) => option.catalogObjectID === value.catalogObjectID}
        onChange={handleCatalogItemChange}
        options={catalogItemOptions.sort((a, b) => a.label.localeCompare(b.label, "en", {ignorePunctuation: true}))}
        renderInput={(params) => <TextField {...params} label="Choose a catalog item" />}
      />
      <h1>{activeCatalogItem.name}</h1>
      <h3>Variations</h3>
    {activeCatalogItem.variations.map((variation) => 
      <div>
        <p>{variation.name}</p>
        {variation.recipe.map((ingredient) => 
          <div>
            <Autocomplete 
              autoHighlight
              disablePortal
              id={`${variation.catalogObjectID}-${ingredient.ingredientID}-name`}
              isOptionEqualToValue={(option, value) => option.inventoryItemID === value.inventoryItemID}
              onChange={handleInventoryItemChange}
              options={inventoryItemOptions}
              renderInput={(params) => <TextField {...params} label="Choose an inventory item" />}
              value={inventoryItemOptions.find((item) => item.name === ingredient.name)}
            />
            <TextField 
              id={`${variation.catalogObjectID}-${ingredient.ingredientID}-quantity`}
              InputProps={{
                endAdornment: <InputAdornment position="end">ounces</InputAdornment>,
              }}
              label="Enter a quantity"
              onChange={handleQuantityChange}
              type="number"
              variant="outlined"
            />
          </div>
        )}
        <Button onClick={handleAddIngredientClick} variant="outlined" value={variation.catalogObjectID}>
          Add Ingredient
        </Button>
      </div>
    )}
    </div>
  );
}

export default CreateRecipeForm;