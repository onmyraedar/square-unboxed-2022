import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function RecipeItem() {
  const [isLoading, setIsLoading] = useState(true);
  const [recipeItem, setRecipeItem] = useState({});
  const [deletionInProgress, setDeletionInProgress] = useState(false);
  const [tabValue, setTabValue] = useState("Variation");
  
  let { itemID } = useParams();

  let navigate = useNavigate();

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
    console.log("Fetch data");
  }, [itemID]);

  function handleClickOpen() {
    setDeletionInProgress(true);
  }

  function handleClose() {
    setDeletionInProgress(false);
  }

  async function handleDelete() {
    console.log("Handling delete");
    try {
      const response = await fetch("/recipeset/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeItem)
      });
      console.log("Request successful!");
      console.log(response);
      setDeletionInProgress(false);
      navigate("/recipe/list");
    } catch (error) {
      console.log(error);
    }   
  }

  return(
    <div>
      {!isLoading && 
        <div>
          <h1>{ recipeItem.name }</h1>
          <Button 
            component={Link}
            to={`/recipe/${recipeItem._id}/edit`}
            variant="contained"
            value={recipeItem._id}
          >
            Edit Recipe
          </Button>
          <Button 
            color="error"
            onClick={handleClickOpen}
            variant="contained"
            value={recipeItem._id}
          >
            Delete Recipe
          </Button>      
          <TabContext value={tabValue}>
            <TabList>
              <Tab label="Variation Recipes" value="Variation"></Tab>
              <Tab label="Modifier Recipes" value="Modifier"></Tab>
            </TabList>
            <TabPanel value="Variation">
            {recipeItem.variations.map((variation) => 
            <div key={variation._id}>
              <b>{variation.name}</b>
              <List>
                {variation.recipe.map((item) => 
                <ListItem key={item._id}>
                  <ListItemText primary={`
                  ${item.ingredient.name}:
                  ${parseFloat(item.quantity["$numberDecimal"])}
                  ${item.ingredient.unit.plural}
                `}/>
                </ListItem>
                )}
              </List>
            </div>
          )}
            </TabPanel>
          </TabContext>
          <h3>Modifiers</h3>
          {recipeItem.modifier_lists.map((modifier_list) => 
            <div key={modifier_list._id}>
              {modifier_list.modifiers.map((modifier) =>
                <div key={modifier._id}>
                  <b>{modifier_list.name} - {modifier.name}</b>
                  <ul>
                    {modifier.recipe.map((item) => 
                      <li key={item._id}>{`
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
      <Dialog 
        open={deletionInProgress}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle>Deleting recipes for {recipeItem.name}</DialogTitle>
        <DialogContent>
        <p>If you proceed, all variation and modifier recipes for this item
          will be deleted from the database. 
        </p>
        <p>Are you sure you want to proceed?</p>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>Close</Button>
          <Button color="error" onClick={handleDelete}>Delete recipes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RecipeItem;