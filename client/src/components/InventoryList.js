import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import "./InventoryList.css";

function InventoryList(props) {
  const { inventory } = props;

  const [editInProgress, setEditInProgress] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});

  let navigate = useNavigate();

  // Controls the edit dialog

  function handleClickOpen(itemID) {
    const selectedItem = inventory.find((item) => item._id === itemID)
    console.log(selectedItem);
    setItemToEdit(selectedItem);
    setEditInProgress(true);
  }

  function handleNameChange(event) {
    setItemToEdit((itemToEdit) => {
      return {
        ...itemToEdit,
        name: event.target.value,
      }
    })
  }

  function handleSingularUnitChange(event) {
    setItemToEdit((itemToEdit) => {
      return {
        ...itemToEdit,
        unit: {
          ...itemToEdit.unit,
          singular: event.target.value,
        }
      }
    })
  }  

  function handlePluralUnitChange(event) {
    setItemToEdit((itemToEdit) => {
      return {
        ...itemToEdit,
        unit: {
          ...itemToEdit.unit,
          plural: event.target.value,
        }
      }
    })
  }  

  function handleClose() {
    setEditInProgress(false);    
  }

  async function handleSaveChanges() {
    console.log("Changes sent to server");
    try {
      const response = await fetch("/inventoryitem/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToEdit)
      });
      console.log("Request successful!");
      console.log(response);
      setEditInProgress(false);
      navigate("/inventory/list");
    } catch (error) {
      console.log(error);
    }     
  }
  
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
              <TableCell />
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
                <TableCell>
                  <IconButton 
                      aria-label="edit"
                      color="primary"
                      onClick={() => handleClickOpen(item._id)}
                    >
                      <EditIcon />
                    </IconButton>                   
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editInProgress &&
      <Dialog 
        open={editInProgress}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle>Edit inventory item</DialogTitle>
        <DialogContent>
        <TextField 
          label="Name"
          onChange={handleNameChange}
          variant="outlined" 
          value={itemToEdit.name}
        />
        <TextField 
          label="Singular unit"
          onChange={handleSingularUnitChange}
          variant="outlined" 
          value={itemToEdit.unit.singular}
        /> 
        <TextField 
          label="Plural unit"
          onChange={handlePluralUnitChange}
          variant="outlined" 
          value={itemToEdit.unit.plural}
        />                 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogActions>
      </Dialog>}   
    </div>
  );
}

export default InventoryList;