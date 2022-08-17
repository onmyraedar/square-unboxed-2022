import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import uniqid from "uniqid";

import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

import AddVariationRecipeStep from "./AddVariationRecipeStep";
import SelectCatalogItemStep from "./SelectCatalogItemStep";
import AddModifierRecipeStep from "./AddModifierRecipeStep";

function CreateRecipeForm(props) {

  const { catalog, inventory } = props;

  const [activeCatalogItem, setActiveCatalogItem] = useState({
    catalogObjectID: "",
    name: "",
    variations: [],
    modifierLists: [],
  });

  // Controls the form stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Select a catalog item", "Add variation recipes", "Add modifier recipes"];
  const completed = [false, false, false];

  let navigate = useNavigate();  

  // Updates state with catalog items from Step 1
  function handleCatalogItemChange(event, value) {

    if (value) {
      console.log(value.label);
    }

    const catalogItem = catalog.items.find((item) => item.id === value.catalogObjectID);
    const variations = catalogItem.itemData.variations;
    
    // Create a new object with blank recipe for each item variation
    const condensedVariations = [];
    for (const variation of variations) {
        condensedVariations.push({
        catalogObjectID: variation.id,
        name: variation.itemVariationData.name,
        recipe: [],
        });
    }

    const condensedModifierLists = [];

    const modifierListsInfo = catalogItem.itemData.modifierListInfo;

    if (modifierListsInfo) {
      for (const modifierListInfo of modifierListsInfo) {
        const catalogModifierList = catalog.modifierLists.find(
          (list) => list.id === modifierListInfo.modifierListId
        );
        const condensedModifierList = {
          catalogObjectID: catalogModifierList.id,
          name: catalogModifierList.modifierListData.name,
          modifiers: [],
        }
        const modifiers = catalogModifierList.modifierListData.modifiers;
        for (const modifier of modifiers) {
          const condensedModifier = {
            catalogObjectID: modifier.id,
            name: modifier.modifierData.name,
            recipe: [],
          }
          condensedModifierList.modifiers.push(condensedModifier);
        }
        condensedModifierLists.push(condensedModifierList);
      }
    }

    setActiveCatalogItem((activeCatalogItem) => {
        return {
        ...activeCatalogItem,
        catalogObjectID: value.catalogObjectID,
        name: value.label,
        variations: condensedVariations,
        modifierLists: condensedModifierLists,
        }
    });
  }  

  // Updates state with ingredient changes from Step 2
  function handleAddIngredient(event) {

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

  // Updates state with modifier ingredient changes from Step 3
  function handleAddModifierIngredient(event) {
    
    const activeModifierID = event.target.value;

    const updatedModifierLists = activeCatalogItem.modifierLists.map(
      (modifierList) => {
        const activeModifier = modifierList.modifiers.find(
          (modifier) => modifier.catalogObjectID === activeModifierID
        );
        if (activeModifier) {
          const updatedModifiers = modifierList.modifiers.map(
            (modifier) => {
              if (modifier.catalogObjectID === activeModifierID) {
                console.log(modifier.name);
                const updatedModifierRecipe = [...modifier.recipe, {
                  ingredientID: uniqid(),
                  inventoryItemID: "PlaceholderID",
                  name: "Placeholder",
                  quantity: 0,            
                }];
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

    setActiveCatalogItem((activeCatalogItem) => {
      return {
        ...activeCatalogItem,
        modifierLists: updatedModifierLists,
      }
    });

  }

  function handleModifierInventoryItemChange(event, value) {

    const parsedID = event.target.id.split("-");
    const activeModifierID = parsedID[0];
    const activeIngredientID = parsedID[1];
    
    console.log(parsedID);

    const updatedModifierLists = activeCatalogItem.modifierLists.map(
      (modifierList) => {
        const activeModifier = modifierList.modifiers.find(
          (modifier) => modifier.catalogObjectID === activeModifierID
        );
        if (activeModifier) {
          const updatedModifiers = modifierList.modifiers.map(
            (modifier) => {
              if (modifier.catalogObjectID === activeModifierID) {
                console.log(modifier.name);
                const updatedModifierRecipe = modifier.recipe.map(
                  (ingredient) => ingredient.ingredientID === activeIngredientID 
                  ? {...ingredient, inventoryItemID: value.inventoryItemID, name: value.label}
                  : ingredient
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

    setActiveCatalogItem((activeCatalogItem) => {
      return {
        ...activeCatalogItem,
        modifierLists: updatedModifierLists,
      }
    });

  }

  function handleModifierQuantityChange(event, value) {

    const parsedID = event.target.id.split("-");
    const activeModifierID = parsedID[0];
    const activeIngredientID = parsedID[1];
    
    console.log(parsedID);

    const updatedModifierLists = activeCatalogItem.modifierLists.map(
      (modifierList) => {
        const activeModifier = modifierList.modifiers.find(
          (modifier) => modifier.catalogObjectID === activeModifierID
        );
        if (activeModifier) {
          const updatedModifiers = modifierList.modifiers.map(
            (modifier) => {
              if (modifier.catalogObjectID === activeModifierID) {
                console.log(modifier.name);
                const updatedModifierRecipe = modifier.recipe.map(
                  (ingredient) => ingredient.ingredientID === activeIngredientID 
                  ? {...ingredient, quantity: event.target.value}
                  : ingredient
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

    setActiveCatalogItem((activeCatalogItem) => {
      return {
        ...activeCatalogItem,
        modifierLists: updatedModifierLists,
      }
    });

  }

  // Autocomplete options

  const catalogItemOptions = catalog.items.map(
    (item) => ({ label: item.itemData.name, catalogObjectID: item.id })
  )
  const inventoryItemOptions = inventory.map(
    (item) => ({ label: item.name, inventoryItemID: item._id })
  )

  function handlePreviousStep() {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  }
  
  async function handleNextStep() {
    if (activeStep === 0) {
      try {
        const response = await fetch(`/catalogitem/find/${activeCatalogItem.catalogObjectID}`);
        const itemData = await response.json();
        // Prevent the user from creating a new recipe for an item
        // If the item (and its recipe) already exist in the database
        if (itemData) {
          console.log("Item already in database!");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(activeStep);
    console.log(activeCatalogItem);
    console.log("Submitted");
    try {
      const response = await fetch("/recipeset/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activeCatalogItem)
      });
      console.log("Request successful!");
      console.log(response);
      navigate("/recipe/list");
    } catch (error) {
      console.log(error);
    }   
  }

  return (
  <div>
    <Stepper nonLinear activeStep={activeStep}>
      {steps.map((label, index) => (
        <Step key={label} completed={completed[index]}>
          <StepLabel>
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>  
    <form onSubmit={handleSubmit}>
      { activeStep === 0 &&
        <SelectCatalogItemStep 
          activeCatalogItem={activeCatalogItem}
          catalogItemOptions={catalogItemOptions}
          handleCatalogItemChange={handleCatalogItemChange}
        />
      }
      {
        activeStep === 1 &&
        <AddVariationRecipeStep 
          activeCatalogItem={activeCatalogItem}
          handleAddIngredient={handleAddIngredient}
          handleInventoryItemChange={handleInventoryItemChange}
          handleQuantityChange={handleQuantityChange}
          inventory={inventory}
          inventoryItemOptions={inventoryItemOptions}
        />
      }
      {
        activeStep === 2 && 
        <AddModifierRecipeStep 
          activeCatalogItem={activeCatalogItem}
          handleAddModifierIngredient={handleAddModifierIngredient}
          handleModifierInventoryItemChange={handleModifierInventoryItemChange}
          handleModifierQuantityChange={handleModifierQuantityChange}
          inventory={inventory}
          inventoryItemOptions={inventoryItemOptions}
        />
      }
      <Button onClick={handlePreviousStep} variant="contained">Back</Button>
      {activeStep < steps.length - 1 && 
        <Button onClick={handleNextStep} type="button" variant="contained">Next</Button>
      }
      {activeStep === steps.length - 1 &&
        <Button type="submit" variant="contained">Submit</Button>
      }
    </form>
  </div>
  );
}

export default CreateRecipeForm;