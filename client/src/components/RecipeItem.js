import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RecipeItem() {
  const [recipeItem, setRecipeItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  let { itemID } = useParams();

  useEffect(() => {
    async function getRecipeItem() {
      try {
        const response = await fetch(`/catalogitem/findbyid/${itemID}`);
        const recipeItemData = await response.json();
        console.log(recipeItemData);
        setRecipeItem(recipeItemData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getRecipeItem();
  }, []);  

  return(
    <div>
      {!isLoading && 
        <div>
          <h1>{ recipeItem.name }</h1>
          <h3>Variations</h3>
          {recipeItem.variations.map((variation) => 
            <div>
              <b>{variation.name}</b>
              <ul>
                {variation.recipe.map((item) => 
                    <li>{`
                      ${item.ingredient.name}:
                      ${parseFloat(item.quantity["$numberDecimal"])}
                      ${item.ingredient.unit.plural}
                    `}</li>
                )}
              </ul>
            </div>
          )}
          <h3>Modifiers</h3>
          {recipeItem.modifier_lists.map((modifier_list) => 
            <div>
              <i>{modifier_list.name}</i>
              {modifier_list.modifiers.map((modifier) =>
                <div>
                  <p>{modifier.name}</p>
                  <ul>
                    {modifier.recipe.map((item) => 
                      <li>{`
                        ${item.ingredient.name}:
                        ${parseFloat(item.quantity["$numberDecimal"])}
                        ${item.ingredient.unit.plural}
                      `}</li>
                    )}                    
                  </ul>
                </div> 
              )}
            </div>
          )}
        </div>
      }
    </div>
  )
}

export default RecipeItem;