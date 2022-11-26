import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useRef, useEffect } from 'react';
import "./../../../../style/ManagerGameLayout.css";

function Orders(props) {
    let itemList=[];
    props["data-values"].forEach((item, index)=>{
        itemList.push(
            <Box id={props["data-id"] + "-item-super-class-" + index} className="cards-sub-content" key={index}>
                <Box id={props["data-id"] + "-" + index + "-item"} className="cards-sub-content-key">Item {props["data-items"][index]}</Box>
                <Box id={props["data-id"] + "-" + index + "-value"} className="cards-sub-content-value">{item}</Box>
            </Box>
        )
    });

    return (
        <Box 
            id={props["data-id"]}
            data-offer-name={props["data-offer-name"]} 
            data-number-of-offers-items={props["data-number-of-offers-items"]} 
            data-values={props["data-values"]} 
            data-items={props["data-items"]} 
            className="order-cards"
        >
            <Box id={props["data-id"] + "-card-heading"} className="order-card-heading">
                <Box className='order-card-heading-text'>
                    {props["data-offer-name"]}
                </Box>
                <Box className='offer-status-div'>
                    <Box className='offer-status'></Box>
                </Box>
            </Box>
            {itemList}
        </Box>
    )
}

export default Orders