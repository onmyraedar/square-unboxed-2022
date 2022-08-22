import React, { useState } from "react";

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

import "./Home.css";

function Home(props) {
  const { importCatalog, importInventory } = props;

  const [isCatalogImported, setIsCatalogImported] = useState(false);
  const [isInventoryImported, setIsInventoryImported] = useState(false);

  async function initialCatalogImport() {
    await importCatalog();
    setIsCatalogImported(true);
  }

  async function initialInventoryImport() {
    await importInventory();
    setIsInventoryImported(true);
  }

  return (
  <div>
    <h1>Get started with Bento</h1>
    <p>
      The following flowchart shows you the five steps of managing inventory with Bento.
    </p>
    <p>
      In this tutorial, we'll go through each of the steps.
    </p>
    <img className="presentation-img" src={require("../assets/bento-presentation/5.jpg")} 
    alt="Five steps for managing your inventory with Bento" />
    <h3>Before you begin, please click the following import buttons.</h3>
    <p>If you ever need to refresh the catalog or inventory, feel free to return to these buttons.</p>
    <Alert severity="warning">
      Failure to import existing data might result in dropdowns with no options, empty tables, and so forth...
    </Alert>    
    <div className="import-btn-container">
      <div className="import-catalog-btn-container">
      <Button color="secondary" onClick={initialCatalogImport}><DownloadIcon />Import Square Catalog</Button>
      { isCatalogImported &&
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        The Square seller catalog has been imported!
      </Alert>  
      } 
      </div>
      <div className="import-inventory-btn-container">
      <Button color="secondary" onClick={initialInventoryImport}><DownloadIcon />Import Inventory Items</Button>   
      { isInventoryImported &&
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Inventory items and their history have been imported!
      </Alert>  
      } 
      </div>
    </div>
    <h3>Now you're ready to follow the tutorial!</h3>
    <p>Inventory items are the "ingredients" of Bento's recipes, as you'll see in Step 2.</p>
    <p>That's why we create them first.</p>
    <img className="presentation-img" src={require("../assets/bento-presentation/9.jpg")} 
    alt="Step 1: Create inventory item" />
    <img className="presentation-img" src={require("../assets/bento-presentation/10.jpg")} 
    alt="Step 2: Create recipe for catalog item" />    
    <img className="presentation-img" src={require("../assets/bento-presentation/11.jpg")} 
    alt="Step 2: Create recipe for catalog item, continued" />
    <img className="presentation-img" src={require("../assets/bento-presentation/12.jpg")} 
    alt="Step 3: Await an order" />
    <img className="presentation-img" src={require("../assets/bento-presentation/13.jpg")} 
    alt="Steps 4-5: Track inventory changes" />               
  </div>);
}

export default Home;