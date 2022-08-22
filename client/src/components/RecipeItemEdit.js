import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Autocomplete from "@mui/material/Autocomplete";
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";

import "./RecipeItemEdit.css";

function RecipeItemEdit(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [recipeItem, setRecipeItem] = useState({});

  const { inventory } = props;
  let { itemID } = useParams();

  let navigate = useNavigate();

  useEffect(() => {
    async function getRecipeItem() {
      try {
        const response = await fetch(`/catalogitem/findbyid/${itemID}`);
        const recipeItemData = await response.json();
        setRecipeItem(recipeItemData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getRecipeItem();
    console.log("Fetch data");
  }, [itemID]);

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
    const activeVariation = recipeItem.variations.find(
      (variation) => variation.catalog_object_id === variationID
    );
    const activeIngredient = activeVariation.recipe.find(
      (item) => item._id === ingredientID
    );
    return activeIngredient.quantity["$numberDecimal"];
  }

  function getModifierQuantity(modifierID, ingredientID) {
    const activeModifierList = recipeItem.modifier_lists.find(
      (modifierList) => modifierList.modifiers.find(
        (modifier) => modifier.catalog_object_id === modifierID
      ));
    const activeModifier = activeModifierList.modifiers.find(
      (modifier) => modifier.catalog_object_id === modifierID
    );     
    const activeIngredient = activeModifier.recipe.find(
      (item) => item._id === ingredientID
    );     
    return activeIngredient.quantity["$numberDecimal"];
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

  function handleInventoryItemChange(event, value) {

    const parsedID = event.target.id.split("-");
    const activeVariationID = parsedID[0];
    const activeIngredientID = parsedID[1];

    const updatedVariations = recipeItem.variations.map(
      (variation) => {
        if (variation.catalog_object_id === activeVariationID) {
          const updatedRecipe = variation.recipe.map(
            (item) => item._id === activeIngredientID 
            ? {...item, 
              ingredient: {
                ...item.ingredient,
                _id: value.inventoryItemID,
                name: value.label
              }}
            : item
          );
          console.log("Updated recipe:");
          console.log(updatedRecipe);
          return {...variation, recipe: updatedRecipe};
        } else {
          return variation;
        }
      }
    );

    setRecipeItem((recipeItem) => {
      return {
        ...recipeItem,
        variations: updatedVariations,
      }
    });    
  }  

  function handleQuantityChange(event, value) {

    const parsedID = event.target.id.split("-");
    const activeVariationID = parsedID[0];
    const activeIngredientID = parsedID[1];

    const updatedVariations = recipeItem.variations.map(
      (variation) => {
        if (variation.catalog_object_id === activeVariationID) {
          const updatedRecipe = variation.recipe.map(
            (item) => item._id === activeIngredientID 
            ? {...item, 
                quantity: {
                ...item.quantity,
                "$numberDecimal": event.target.value,
              }}
            : item
          );
          console.log("Updated recipe:");
          console.log(updatedRecipe);
          return {...variation, recipe: updatedRecipe};
        } else {
          return variation;
        }
      }
    );

    setRecipeItem((recipeItem) => {
      return {
        ...recipeItem,
        variations: updatedVariations,
      }
    });    
  }   

  function handleModifierInventoryItemChange(event, value) {

    const parsedID = event.target.id.split("-");
    const activeModifierID = parsedID[0];
    const activeIngredientID = parsedID[1];
    
    console.log(parsedID);

    const updatedModifierLists = recipeItem.modifier_lists.map(
      (modifierList) => {
        const activeModifier = modifierList.modifiers.find(
          (modifier) => modifier.catalog_object_id === activeModifierID
        );
        if (activeModifier) {
          const updatedModifiers = modifierList.modifiers.map(
            (modifier) => {
              if (modifier.catalog_object_id === activeModifierID) {
                console.log(modifier.name);
                const updatedModifierRecipe = modifier.recipe.map(
                  (item) => item._id === activeIngredientID 
                  ? {...item, 
                    ingredient: {
                      ...item.ingredient,
                      _id: value.inventoryItemID,
                      name: value.label
                    }}
                  : item
                );                
                console.log(updatedModifierRecipe);
                const updatedModifier = {...modifier, recipe: updatedModifierRecipe};
                return updatedModifier;
              } else {
                return modifier;
              }
            }
          )
          const updatedModifierList = {...modifierList, modifiers: updatedModifiers};
          return updatedModifierList;
        } else {
          return modifierList;
        }
      }
    );

    setRecipeItem((recipeItem) => {
      return {
        ...recipeItem,
        modifier_lists: updatedModifierLists,
      }
    });

  }  

  function handleModifierQuantityChange(event, value) {

    const parsedID = event.target.id.split("-");
    const activeModifierID = parsedID[0];
    const activeIngredientID = parsedID[1];
    
    console.log(parsedID);

    const updatedModifierLists = recipeItem.modifier_lists.map(
      (modifierList) => {
        const activeModifier = modifierList.modifiers.find(
          (modifier) => modifier.catalog_object_id === activeModifierID
        );
        if (activeModifier) {
          const updatedModifiers = modifierList.modifiers.map(
            (modifier) => {
              if (modifier.catalog_object_id === activeModifierID) {
                console.log(modifier.name);
                const updatedModifierRecipe = modifier.recipe.map(
                  (item) => item.ingredient._id === activeIngredientID 
                  ? {...item, 
                    quantity: {
                    ...item.quantity,
                    "$numberDecimal": event.target.value,
                  }}
                : item
                );                
                console.log(updatedModifierRecipe);
                const updatedModifier = {...modifier, recipe: updatedModifierRecipe};
                return updatedModifier;
              } else {
                return modifier;
              }
            }
          )
          const updatedModifierList = {...modifierList, modifiers: updatedModifiers};
          return updatedModifierList;
        } else {
          return modifierList;
        }
      }
    );

    setRecipeItem((recipeItem) => {
      return {
        ...recipeItem,
        modifier_lists: updatedModifierLists,
      }
    });

  }   

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Submitted");
    try {
      const response = await fetch("/recipeset/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeItem)
      });
      console.log("Request successful!");
      console.log(response);
      navigate(`/recipe/${recipeItem._id}`);
    } catch (error) {
      console.log(error);
    }   
  }

  const inventoryItemOptions = inventory.map(
    (item) => ({ label: item.name, inventoryItemID: item._id })
  )  

  return(
    <div>
      {!isLoading && 
        <div>
          <h1>{ recipeItem.name }</h1>
          <Button 
            component={Link}
            to={`/recipe/${recipeItem._id}`}
            variant="outlined"
            value={recipeItem._id}
          >
            Back to View
          </Button>
          <form onSubmit={handleSubmit}>
          <h3>Variations</h3>
          {recipeItem.variations.map((variation) => 
            <div key={variation._id}>
              <b>{variation.name}</b>
              {variation.recipe.map((item) => 
                <div className="ingredient-edit-mode" key={item._id}>
                  <Autocomplete 
                  autoHighlight
                  disablePortal
                  id={`${variation.catalog_object_id}-${item._id}-name`}
                  isOptionEqualToValue={(option, value) => option.inventoryItemID === value.inventoryItemID}
                  onChange={handleInventoryItemChange}
                  options={inventoryItemOptions}
                  renderInput={(params) => <TextField {...params} label="Choose an inventory item" variant="standard" />}
                  style={{minWidth: 400}}
                  value={getInventoryItem(item.ingredient._id)}
                />
                <TextField 
                  id={`${variation.catalog_object_id}-${item._id}-quantity`}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{getPluralUnit(item.ingredient._id)}</InputAdornment>,
                  }}
                  label="Enter a quantity"
                  onChange={handleQuantityChange}
                  type="number"
                  variant="standard"
                  value={getQuantity(variation.catalog_object_id, item._id)}
                />     
                </div>                           
              )}
            </div>
          )}
          <h3>Modifiers</h3>
          {recipeItem.modifier_lists.map((modifier_list) => 
            <div key={modifier_list._id}>
              {modifier_list.modifiers.map((modifier) =>
                <div key={modifier._id}>
                  <b>{modifier_list.name} - {modifier.name}</b>
                  {modifier.recipe.length > 0 && modifier.recipe.map((item) => 
                    <div className="ingredient-edit-mode" key={item._id}>
                      <Autocomplete 
                        autoHighlight
                        disablePortal
                        id={`${modifier.catalog_object_id}-${item._id}-name`}
                        isOptionEqualToValue={(option, value) => option.inventoryItemID === value.inventoryItemID}
                        onChange={handleModifierInventoryItemChange}
                        options={inventoryItemOptions}
                        renderInput={(params) => <TextField {...params} label="Choose an inventory item" variant="standard" />}
                        style={{minWidth: 400}}
                        value={getInventoryItem(item.ingredient._id)}
                      />
                      <TextField 
                        id={`${modifier.catalog_object_id}-${item.ingredient._id}-quantity`}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">{getPluralUnit(item.ingredient._id)}</InputAdornment>,
                        }}
                        label="Enter a quantity"
                        onChange={handleModifierQuantityChange}
                        type="number"
                        variant="standard"
                        value={getModifierQuantity(modifier.catalog_object_id, item._id)}
                      />                       
                    </div>
                  )}
                  {!modifier.recipe.length > 0 && 
                  <p>No ingredients to show for this modifier.</p>
                  }                
                </div> 
              )}
            </div>
          )}  
          <Button type="submit" variant="contained">Submit</Button>
          </form>
        </div>
      }              
    </div>
  )
}

export default RecipeItemEdit;