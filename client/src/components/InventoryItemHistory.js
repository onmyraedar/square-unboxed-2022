import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./InventoryItemHistory.css";

function InventoryItemHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryItemChanges, setInventoryItemChanges] = useState([]);

  let { itemID } = useParams();
  
  useEffect(() => {
    async function getInventoryItemAndChanges() {
      try {
        const response = await fetch(`/inventoryitemchange/findbyinventoryitem/${itemID}`);
        const inventoryItemChangeData = await response.json();
        console.log(inventoryItemChangeData);
        setInventoryItemChanges(inventoryItemChangeData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getInventoryItemAndChanges();
    console.log("Fetch data");
  }, [itemID]);

  function getCondensedChange(inventoryItemChange) {
    const changeQuantity = parseFloat(inventoryItemChange.quantity["$numberDecimal"]);
    const changeType = inventoryItemChange.type;
    let condensedChange = 0;
    if (changeType === "DEDUCTION" && changeQuantity > 0 || changeType === "ADDITION" && changeQuantity < 0) {
      condensedChange = -changeQuantity;
    } else if (changeType === "ADDITION" && changeQuantity > 0 || changeType === "DEDUCTION" && changeQuantity < 0) {
      condensedChange = changeQuantity;
    } else if (changeQuantity === 0) {
      condensedChange = changeQuantity;
    }
    return condensedChange;
  }

  function createRow(inventoryItemChange) {
    return {
      id: inventoryItemChange._id,
      quantityBefore: parseFloat(inventoryItemChange.quantity_in_stock.before["$numberDecimal"]),
      change: getCondensedChange(inventoryItemChange),
      quantityAfter: parseFloat(inventoryItemChange.quantity_in_stock.after["$numberDecimal"]),
      fromOrder: inventoryItemChange.order ? true : false,
      reason: inventoryItemChange.reason,
    }
  }
  
  const rows = inventoryItemChanges.map(createRow);
  
  const columns = [
    { field: "id", hide: true },
    { field: "quantityBefore", headerName: "Quantity before change", type: "number", width: 200 },
    {
      field: "change", 
      headerName: "Change", 
      type: "number", 
      width: 150, 
      cellClassName: (params) => {
        if (params.value === null || params.value === 0) {
          return "";
        } else if (params.value > 0) {
          return "positive";
        } else if (params.value < 0) {
          return "negative";
        }
      },
    },
    { field: "quantityAfter", headerName: "Quantity after change", type: "number", width: 200 },
    { field: "fromOrder", headerName: "From order?", type: "boolean", width: 120 },
    { field: "reason", headerName: "Reason", width: 150 }
  ];

  return(
  <div>
    <h1>Inventory item history</h1>
    <div className="data-grid-container">
      {!isLoading && <DataGrid rows={rows} columns={columns} />}
    </div>
  </div>);
}

export default InventoryItemHistory;

