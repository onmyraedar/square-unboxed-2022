import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function RecipeItemList() {
  const [recipeItems, setRecipeItems] = useState([]);

  useEffect(() => {
    async function getRecipeItems() {
      try {
        const response = await fetch("/catalogitem/all");
        const recipeItemData = await response.json();
        setRecipeItems(recipeItemData);
      } catch (error) {
        console.log(error);
      }
    }
    getRecipeItems();
  }, []);

  return(
    <div>
      <h1>View recipes</h1>
      <p>The items below already have recipes in the database.</p>
      <p>Click on an item to view and edit its recipes.</p>
      {recipeItems.map((item) => 
        <div>
          <Card variant="outlined">
            <CardContent>
              <p>{item.name}</p>
              <Button 
                component={Link}
                to={`/recipe/${item._id}`}
                variant="outlined"
                value={item._id}
              >
                View Item
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default RecipeItemList;