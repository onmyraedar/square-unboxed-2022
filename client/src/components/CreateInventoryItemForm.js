import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";

function CreateInventoryItemForm(props) {
  const { importInventory } = props;

  const [inventoryItem, setInventoryItem] = useState({
    name: "",
    quantity_in_stock: 0,
    singular_unit: "",
    plural_unit: "",
  });

  let navigate = useNavigate();

  async function createInventoryItem(event) {
    event.preventDefault();
    console.log("Initializing inventory item...");
    const inventoryItemData = {
      name: inventoryItem.name,
      quantity_in_stock: inventoryItem.quantity_in_stock,
      unit: {
        singular: inventoryItem.singular_unit,
        plural: inventoryItem.plural_unit,
      }
    }
    console.log(inventoryItemData);
    console.log("Inventory item initialized!");
    try {
      const response = await fetch("/inventoryitem/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryItemData)
      });
      console.log("Request successful!");
      importInventory();
      navigate("/inventory/list");
    } catch (error) {
      console.log(error);
    }
    console.log("End of function.");
  }

  function handleInputChange(event) {
    const inputName = event.target.name;
    setInventoryItem((inventoryItem) => {
      return {
        ...inventoryItem,
        [`${inputName}`]: event.target.value,
      }
    })
  }

  return(
    <div>
      <h1>Create inventory item</h1>
      <p>When you create an inventory item, you can then add it to a recipe.</p>  
      <p>Adding an inventory item to a recipe lets Bento deduct a preset amount
        of that item from inventory whenever the user buys 
        a specific catalog item ("makes the recipe").
      </p>  
      <p>Example:</p>
      <ol>
        <li>You create an inventory item called Waffle Cones.</li>
        <li>You set up a recipe for Ice Cream Surprise, which is
          an existing item in your Square catalog. In the recipe,
          you specify that 1 Waffle Cone is needed for each 
          order of Ice Cream Surprise.
        </li>
        <li>When a customer orders Ice Cream Surprise, Bento will
          automatically deduct 1 Waffle Cone from your inventory!
        </li>
      </ol>
      <form>
        <TextField 
          name="name"
          label="Item name"
          onChange={handleInputChange}
          value={inventoryItem.name}
          variant="outlined"
        />
        <TextField 
          name="quantity_in_stock"
          label="Quantity in stock"
          onChange={handleInputChange}
          type="number"
          value={inventoryItem.quantity_in_stock}
          variant="outlined"
        />     
        <TextField 
          name="singular_unit"
          label="Singular unit"
          onChange={handleInputChange}
          value={inventoryItem.singular_unit}
          variant="outlined"
        />            
        <TextField 
          name="plural_unit"
          label="Plural unit"
          onChange={handleInputChange}
          value={inventoryItem.plural_unit}
          variant="outlined"
        />  
        <Button onClick={createInventoryItem} type="submit" variant="outlined">Create Item</Button>
      </form>
    </div>
  );
}

export default CreateInventoryItemForm;