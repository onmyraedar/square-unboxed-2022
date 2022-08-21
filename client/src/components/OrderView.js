import React, { useState } from "react";

import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function OrderView(props) {
  const { order } = props;
  const [detailsOpen, setDetailsOpen] = useState(false);

  function formatModifierNames(modifiers) {
    const modifierNames = [];
    for (const modifier of modifiers) {
      modifierNames.push(modifier.name);
    }
    return modifierNames.join(", ");
  }

  function toggleDetails() {
    setDetailsOpen((detailsOpen) => !detailsOpen);
  }

  return(
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            size="small"
            onClick={toggleDetails}
          >
            {detailsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>        
        <TableCell component="th" scope="row">
            {`Order created at #${order.created_at.date} ${order.created_at.time}`}
          </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
            <h3>Order details</h3>
            {order.line_items.map((line_item) => 
            <div>
              <p>{`${line_item.name} (${line_item.variation_name})`}</p>
              <p>{`Modifiers: ${formatModifierNames(line_item.modifiers)}`}</p>
              {line_item.inventory_item_changes.length > 0 
              ?
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={3}>Inventory item deductions</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Inventory item name</TableCell>
                    <TableCell>Quantity deducted</TableCell>
                    <TableCell>Recipe</TableCell>                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {line_item.inventory_item_changes.map((inventoryItemChange) => 
                  <TableRow>
                    <TableCell>{inventoryItemChange.inventory_item.name}</TableCell>
                    <TableCell>
                        {`${parseFloat(inventoryItemChange.quantity["$numberDecimal"])}
                        ${parseFloat(inventoryItemChange.quantity["$numberDecimal"]) > 1
                          ? inventoryItemChange.inventory_item.unit.plural
                          : inventoryItemChange.inventory_item.unit.singular
                        }
                        `}
                    </TableCell>
                    <TableCell>{inventoryItemChange.reason}</TableCell>
                  </TableRow>
                  )}
                </TableBody>
              </Table>
              : <p>No inventory changes for this item!</p>
              }
            </div>)}        
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default OrderView;