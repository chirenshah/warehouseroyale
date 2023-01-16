import { Box } from '@mui/material';
import React, { useState } from 'react';
import './../../../../style/ManagerGameLayout.css';

function Orders(props) {
  // console.log(props.data);
  let title = props['data']['title'];
  let status = props['data']['status'];
  let itemList = { ...props.data };
  switch (status) {
    case 'Not Selected':
      var color = '#3f418d';
      break;
    case 'Selected':
      var color = '#e6cc00';
      break;
    case 'Successful':
      var color = 'green';
      break;
    case 'Partial':
      var color = 'red';
  }
  delete itemList['title'];
  delete itemList['status'];
  return (
    <Box className="order-cards">
      <Box className="order-card-heading">
        <Box className="order-card-heading-text">{title}</Box>
        <Box className="offer-status-div">
          <Box className="offer-status" style={{ backgroundColor: color }}>
            {}
          </Box>
        </Box>
      </Box>
      {Object.keys(itemList).map((item, index) => (
        <Box className="cards-sub-content" key={index}>
          <Box className="cards-sub-content-key">{item}</Box>
          <Box className="cards-sub-content-value">{itemList[item]}</Box>
        </Box>
      ))}
    </Box>
  );
}

export default Orders;
