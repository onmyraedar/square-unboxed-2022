import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import ExposureIcon from '@mui/icons-material/Exposure';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import "./InventoryList.css";

function InventoryList(props) {
  const { importInventory, inventory } = props;

  const [editInProgress, setEditInProgress] = useState(false);
  const [quantityChangeInProgress, setQuantityChangeInProgress] = useState(false);

  const [itemToEdit, setItemToEdit] = useState({});
  const [quantityChangeDetails, setQuantityChangeDetails] = useState({
    type: "ADDITION",
    inventory_item: {},
    quantity_change: 0,
    quantity_change_error: false,
    reason: "",    
  });

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

  // Controls the quantity change dialog

  function handleClickQuantityChangeOpen(item) {
    setQuantityChangeDetails({
      type: "ADDITION",
      inventory_item: item,
      quantity_change: 0,
      quantity_change_error: false,
      reason: "",
    });
    setQuantityChangeInProgress(true);
    console.log(item);
  }

  function handleReasonChange(event) {
    setQuantityChangeDetails((quantityChange) => {
      return {
        ...quantityChange,
        reason: event.target.value,
      }
    });
  }  

  function handleQuantityChange(event) {
    setQuantityChangeDetails((quantityChange) => {
      return {
        ...quantityChange,
        quantity_change: event.target.value,
      }
    });
  }

  function handleTypeChange(event) {
    setQuantityChangeDetails((quantityChange) => {
      return {
        ...quantityChange,
        type: event.target.value,
      }
    });
  }

  function handleQuantityChangeClose() {
    setQuantityChangeInProgress(false);    
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
      importInventory();
      navigate("/inventory/list");
    } catch (error) {
      console.log(error);
    }     
  }
  
  async function handleSaveQuantityChange() {
    const quantityChange = parseFloat(quantityChangeDetails.quantity_change);
    const quantityInStock = parseFloat(quantityChangeDetails.inventory_item.quantity_in_stock["$numberDecimal"]);
    if (quantityChangeDetails.type === "DEDUCTION" && quantityChange > quantityInStock) {
      console.log("change invalid");
      setQuantityChangeDetails((quantityChange) => {
        return {
          ...quantityChange,
          quantity_change_error: true,
        }
      });
  } else {
      setQuantityChangeDetails((quantityChange) => {
        return {
          ...quantityChange,
          quantity_change_error: false,
        }
      });
      console.log("Quantity change sent to server");
      try {
        const response = await fetch("/inventoryitemchange/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quantityChangeDetails)
        });
        console.log("Request successful!");
        console.log(response);
        setQuantityChangeInProgress(false);
        importInventory();
        navigate("/inventory/list");      
      } catch (error) {
        console.log(error);
      }
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
                      aria-label="make-quantity-change"
                      color="primary"
                      onClick={() => handleClickOpen(item._id)}
                    >
                      <EditIcon />
                    </IconButton>                   
                </TableCell>                  
                <TableCell>
                  <IconButton 
                      aria-label="edit"
                      color="primary"
                      onClick={() => handleClickQuantityChangeOpen(item)}
                    >
                      <ExposureIcon />
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
      {quantityChangeInProgress &&
        <Dialog 
            open={quantityChangeInProgress}
            onClose={handleQuantityChangeClose}
            scroll="paper"
          >
            <DialogTitle>Manually edit inventory item quantity</DialogTitle>
            <DialogContent> 
              <p>Currently editing: <b>{quantityChangeDetails.inventory_item.name}</b></p>   
              <p>Current quantity in stock: <b>
                {`${parseFloat(quantityChangeDetails.inventory_item.quantity_in_stock["$numberDecimal"])} 
                    ${parseFloat(quantityChangeDetails.inventory_item.quantity_in_stock["$numberDecimal"]) > 0
                      ? quantityChangeDetails.inventory_item.unit.plural
                      : quantityChangeDetails.inventory_item.unit.singular
                    }
                `}</b></p>
            <FormControl>
              <InputLabel id="type-select-label">Type</InputLabel>
              <Select
                label="Select change type"
                labelId="type-select-label"
                onChange={handleTypeChange}
                value={quantityChangeDetails.type}
              >
                <MenuItem value="ADDITION">
                  Addition
                </MenuItem>
                <MenuItem value="DEDUCTION">
                  Deduction
                </MenuItem>                
              </Select>
            </FormControl>  
            <TextField 
              label="Reason"
              onChange={handleReasonChange}
              variant="outlined" 
              value={quantityChangeDetails.reason}
            />
            {quantityChangeDetails.quantity_change_error
            ? 
            <TextField 
            error
            label="Quantity to add/deduct"
            helperText="You can't deduct more stock than you have in inventory!"
            InputProps={{
              endAdornment: <InputAdornment position="end">{quantityChangeDetails.inventory_item.unit.plural}</InputAdornment>,
            }}            
            onChange={handleQuantityChange}
            type="number"
            value={quantityChangeDetails.quantity_change}
            variant="outlined"
            />
            : 
            <TextField 
            label="Quantity to add/deduct"
            InputProps={{
              endAdornment: <InputAdornment position="end">{quantityChangeDetails.inventory_item.unit.plural}</InputAdornment>,
            }}            
            onChange={handleQuantityChange}
            type="number"
            value={quantityChangeDetails.quantity_change}
            variant="outlined"
            />
            }                      
            </DialogContent>
            <DialogActions>
              <Button onClick={handleQuantityChangeClose}>Close</Button>
              <Button onClick={handleSaveQuantityChange}>Save Changes</Button>
            </DialogActions>
        </Dialog>
      }
    </div>
  );
}

export default InventoryList;