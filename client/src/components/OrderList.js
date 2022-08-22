import React, { Fragment, useEffect, useState } from "react";

import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RefreshIcon from '@mui/icons-material/Refresh';

import OrderView from "./OrderView";

function OrderList() {

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await fetch("/order/all");
        const orderData = await response.json();
        console.log(orderData);
        setOrders(orderData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getOrders();
  }, []);

  async function refreshOrders() {
    try {
      const response = await fetch("/order/all");
      const orderData = await response.json();
      console.log("Orders refreshed!");
      setOrders(orderData);
    } catch (error) {
      console.log(error);
    }
  }

  return(
    <div>
      <h1>View orders</h1>
      {!isLoading && 
      <Fragment>
        <Button color="secondary" onClick={refreshOrders} variant="outlined">
          Refresh orders  <RefreshIcon />
        </Button>        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>Orders</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <OrderView order={order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fragment>  
      }
    </div>
  );
}

export default OrderList;