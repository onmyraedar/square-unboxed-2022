import React from "react";
import { Link } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "./InventoryList.css";

function InventoryList(props) {
  const { inventory } = props;
  
  return(
    <div>
      <h1>View inventory items</h1>
      <p>Here are the inventory items you are currently tracking with Bento.</p>
      <p>If you don't see any items, create one <Link className="internal-link" to="/inventory/create">here</Link>.</p>
      <p>Click the Refresh button to update the table with any inventory changes.</p>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Quantity in stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item._id}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell>
                  {`${parseFloat(item.quantity_in_stock["$numberDecimal"])} 
                    ${parseFloat(item.quantity_in_stock["$numberDecimal"]) > 0
                      ? item.unit.plural
                      : item.unit.singular
                    }
                  `}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default InventoryList;