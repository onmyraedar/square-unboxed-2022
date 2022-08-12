import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CreateRecipeForm from "./components/CreateRecipeForm";

function App() {
  const [data, setData] = useState("No data yet");
  const [catalog, setCatalog] = useState({
    items: [],
    modifierLists: [],
  });
  const [inventory, setInventory] = useState([]);

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
      console.log("Catalog has been imported!");
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

  return (
    <div className="App">
      <button onClick={addInventoryItem}>Add Item</button>
      <button onClick={importCatalog}>Import Catalog</button>
      <button onClick={importInventory}>Import Inventory</button>
      <p>{data}</p>
      <Link to="/recipe/create">Create Recipe</Link>
      <Routes>
        <Route path="/recipe/create" element={<CreateRecipeForm catalog={catalog} inventory={inventory} />} />
      </Routes>
    </div>
  );
}

export default App;
