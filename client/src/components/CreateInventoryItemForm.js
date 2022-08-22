import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import "./CreateInventoryItemForm.css";

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
      <p>Create an item here to begin tracking its inventory with Bento.</p> 
        <p>
          A singular unit refers to one item.
          If I say "I have one ice cream <b>cone</b>,"
          <b> cone</b> is the singular unit.
        </p>
        <p>
          A plural unit refers to more than one item.
          If I say "I have three ice cream <b>cones</b>,"
          <b> cones</b> is the plural unit.      
        </p>
      <form className="create-inventory-item-form" onSubmit={createInventoryItem}>
        <TextField 
          name="name"
          label="Item name"
          onChange={handleInputChange}
          required={true}
          value={inventoryItem.name}
          variant="outlined"
        />
        <TextField 
          name="quantity_in_stock"
          label="Quantity in stock"
          onChange={handleInputChange}
          type="number"
          required={true}
          value={inventoryItem.quantity_in_stock}
          variant="outlined"
        />     
        <TextField 
          name="singular_unit"
          label="Singular unit"
          onChange={handleInputChange}
          required={true}
          value={inventoryItem.singular_unit}
          variant="outlined"
        />            
        <TextField 
          name="plural_unit"
          label="Plural unit"
          onChange={handleInputChange}
          required={true}
          value={inventoryItem.plural_unit}
          variant="outlined"
        />
        <div className="create-inventory-item-btn-container">
          <Button type="submit" variant="contained">Create Item</Button>
        </div>
      </form>
    </div>
  );
}

export default CreateInventoryItemForm;