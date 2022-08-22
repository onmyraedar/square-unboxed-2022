import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function OrderSummary(props) {
  const { handleCompleteOrder, handleDeleteLineItem, isOrderProcessing, order } = props;

  return(      
    <div>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Item #</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.lineItems.map((orderLineItem, index) => (
              <React.Fragment>
                <TableRow>
                  <TableCell rowSpan={orderLineItem.components.length + 1}>
                  <IconButton 
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDeleteLineItem(orderLineItem.id)}
                  >
                    <DeleteIcon />
                  </IconButton>                    
                  </TableCell>                 
                  <TableCell rowSpan={orderLineItem.components.length + 1}>{index + 1}</TableCell>
                </TableRow>
                {orderLineItem.components.map((orderLineItemComponent) => 
                <TableRow>
                  <TableCell>{orderLineItemComponent.name}</TableCell>
                  <TableCell>{orderLineItemComponent.formattedPrice}</TableCell>
                </TableRow>
                )}
              </React.Fragment>
            ))}            
            <TableRow>
              <TableCell colSpan={2} />
              <TableCell><b>Total</b></TableCell>
              <TableCell><b>{order.total}</b></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <LoadingButton
          size="small"
          onClick={handleCompleteOrder}
          endIcon={<ShoppingCartIcon />}
          loading={isOrderProcessing}
          loadingPosition="end"
          variant="contained"
        >
          Complete Checkout
        </LoadingButton>      
    </div>
  );
}

export default OrderSummary;