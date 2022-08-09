import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("No message yet");
  const [data, setData] = useState("No data yet");
  const [catalog, setCatalog] = useState({
    items: [],
    modifierLists: [],
  });

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

  return (
    <div className="App">
      <button onClick={getMessage}>Get Message</button>
      <button onClick={addInventoryItem}>Add Item</button>
      <button onClick={importCatalog}>Import Catalog</button>
      <p>{message}</p>
      <p>{data}</p>
      {catalog.items.map((item) => (
        <p>{item.itemData.name}</p>
      ))}
      {catalog.modifierLists.map((modifierList) => (
        <p>{modifierList.modifierListData.name}</p>
      ))}
    </div>
  );
}

export default App;
