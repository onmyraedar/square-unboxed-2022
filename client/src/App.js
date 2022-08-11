import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import uniqid from "uniqid";

function App() {
  const [message, setMessage] = useState("No message yet");
  const [data, setData] = useState("No data yet");
  const [catalog, setCatalog] = useState({
    items: [],
    modifierLists: [],
  });
  const [activeCatalogItem, setActiveCatalogItem] = useState({
    catalogObjectID: "",
    name: "",
    variations: [],
  });
  const [inventory, setInventory] = useState([]);

  // Testing a GET request
  async function getMessage() {
    try {
      const response = await fetch("/message");
      const messageData = await response.json();
      setMessage(messageData);
    } catch (error) {
      console.log(error);
    }
  }

  // Testing a POST request
  async function addInventoryItem() {
    console.log("Initializing inventory item...");
    const inventoryItem = {
      name: "Ice Cream",
      quantity_in_stock: 100,
      unit: {
        singular: "ounce",
        plural: "ounces"
      }
    }
    console.log("Inventory item initialized!");
    console.log(inventoryItem);
    try {
      const response = await fetch("/inventoryitem/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryItem)
      });
      setData("Post request successful!");
      console.log("Request successful!");
    } catch (error) {
      console.log(error);
    }
    console.log("End of function.");
  }

  async function importCatalog() {
    try {
      const response = await fetch("/catalog/import");
      const catalogData = await response.json();
      const catalogItems = catalogData.filter(
        (catalogObject) => catalogObject.type === "ITEM"
      );
      const catalogModifierLists = catalogData.filter(
        (catalogObject) => catalogObject.type === "MODIFIER_LIST"
      );
      setCatalog({
        items: catalogItems,
        modifierLists: catalogModifierLists,
      });
      console.log("This statement is reached.");
    } catch (error) {
      console.log(error);
    }    
  }

  async function importInventory() {
    try {
      const response = await fetch("/inventory/import");
      const inventoryData = await response.json();
      console.log(inventoryData);
      setInventory(inventoryData);
    } catch (error) {
      console.log(error);
    }
  }

  function handleCatalogItemChange(event, value) {
    console.log(value.catalogObjectID);
    const item = catalog.items.find((item) => item.id === value.catalogObjectID);
    const variations = item.itemData.variations;
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
    console.log(activeCatalogItem);
  }

  function handleInventoryItemChange(event, value) {
    console.log(event.target.id);
    const parsedID = event.target.id.split("-");
    const activeVariationID = parsedID[0];
    const activeIngredientID = parsedID[1];
    const activeVariation = activeCatalogItem.variations.find(
      (variation) => variation.catalogObjectID === activeVariationID
    );
    console.log(activeVariation);
    const activeIngredient = activeVariation.recipe.find(
      (ingredient) => ingredient.ingredientID === activeIngredientID
    );
    console.log(activeIngredient);
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
    console.log(event.target.id);
    const parsedID = event.target.id.split("-");
    const activeVariationID = parsedID[0];
    const activeIngredientID = parsedID[1];
    const activeVariation = activeCatalogItem.variations.find(
      (variation) => variation.catalogObjectID === activeVariationID
    );
    console.log(activeVariation);
    const activeIngredient = activeVariation.recipe.find(
      (ingredient) => ingredient.ingredientID === activeIngredientID
    );
    console.log(activeIngredient);
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
    const activeVariation = activeCatalogItem.variations.find(
      (variation) => variation.catalogObjectID === event.target.value
    );
    console.log(activeVariation.name);
    const updatedVariations = activeCatalogItem.variations.map(
      (variation) => {
        if (variation.catalogObjectID === event.target.value) {
          const updatedRecipe = [...variation.recipe];
          updatedRecipe.push({
            ingredientID: uniqid(),
            inventoryItemID: "PlaceholderID",
            name: "Placeholder",
            quantity: 0,
          });
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
    <div className="App">
      <button onClick={getMessage}>Get Message</button>
      <button onClick={addInventoryItem}>Add Item</button>
      <button onClick={importCatalog}>Import Catalog</button>
      <button onClick={importInventory}>Import Inventory</button>
      <p>{message}</p>
      <p>{data}</p>
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
          {variation.recipe.map(
            (ingredient) => 
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

export default App;
