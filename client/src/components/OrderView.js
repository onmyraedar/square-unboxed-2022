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
            {`Order #${order.order_id}`}
          </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
            <h3>Order details</h3>
            <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Modifiers</TableCell>
                    <TableCell>Inventory item deductions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.line_items.map((line_item) => 
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <p>{`${line_item.name} (${line_item.variation_name})`}</p>
                    </TableCell>
                    <TableCell>
                      {line_item.modifiers.map((modifier) =>
                        <p>{modifier.name}</p>
                      )}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  )}
                </TableBody>
              </Table>            
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default OrderView;