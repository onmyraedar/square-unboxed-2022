import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CreateInventoryItemForm from "./components/CreateInventoryItemForm";
import CreateRecipeForm from "./components/CreateRecipeForm";
import Header from "./components/Header";
import InventoryList from "./components/InventoryList";
import Navbar from "./components/Navbar";
import OrderList from "./components/OrderList";
import OrderTest from "./components/OrderTest";
import RecipeItem from "./components/RecipeItem";
import RecipeItemEdit from "./components/RecipeItemEdit";
import RecipeItemList from "./components/RecipeItemList";
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
      console.log(catalog);
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
            <Route path="/recipe/list" element={<RecipeItemList />} />
            <Route path="/recipe/:itemID" element={<RecipeItem />} />
            <Route path="/recipe/:itemID/edit" element={<RecipeItemEdit inventory={inventory} />} />
            <Route path="/inventory/create" element={<CreateInventoryItemForm importInventory={importInventory}/>} />
            <Route path="/inventory/list" element={<InventoryList inventory={inventory}/>} />
            <Route path="/order/test" element={<OrderTest catalog={catalog}/>} />
            <Route path="/order/list" element={<OrderList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
