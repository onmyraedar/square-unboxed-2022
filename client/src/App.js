import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CreateInventoryItemForm from "./components/CreateInventoryItemForm";
import CreateRecipeForm from "./components/CreateRecipeForm";
import Header from "./components/Header";
import InventoryList from "./components/InventoryList";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [catalog, setCatalog] = useState({
    items: [],
    modifierLists: [],
  });
  const [inventory, setInventory] = useState([]);

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
      <Header />
      <div className="App-container">
        <Navbar />
        <div className="App-content">
          <button onClick={importCatalog}>Import Catalog</button>
          <button onClick={importInventory}>Import Inventory</button>
          <Routes>
            <Route path="/recipe/create" element={<CreateRecipeForm catalog={catalog} inventory={inventory} />} />
            <Route path="/inventory/create" element={<CreateInventoryItemForm />} />
            <Route path="/inventory/list" element={<InventoryList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
