import React, { useEffect, useState } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import OrderView from "./OrderView";

function OrderList() {

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await fetch("/order/all");
        const orderData = await response.json();
        setOrders(orderData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getOrders();
  }, []);

  return(
    <div>
      <h1>View orders</h1>
      {!isLoading && 
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
      }
    </div>
  );
}

export default OrderList;