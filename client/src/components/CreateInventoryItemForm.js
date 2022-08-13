import React, { useState } from "react";

function CreateInventoryItemForm() {
  const [data, setData] = useState("No data yet");

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

  return(
    <div>
      <p>Here's the inventory item form!</p>
      <button onClick={addInventoryItem}>Add Item</button>
      <p>{data}</p>
    </div>
  );
}

export default CreateInventoryItemForm;