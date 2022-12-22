import { Box } from "@mui/material";
import React, { useState } from "react";
import "./../../../../style/ManagerGameLayout.css";

function Orders(props) {
    // console.log(props.data);
    let title = props["data"]["title"];
    let status = props["data"]["status"];
    let itemList = { ...props.data };
    delete itemList["title"];
    delete itemList["status"];
    return (
        <Box className="order-cards">
            <Box className="order-card-heading">
                <Box className="order-card-heading-text">{title}</Box>
                <Box className="offer-status-div">
                    <Box
                        className="offer-status"
                        style={{ backgroundColor: status ? "green" : null }}
                    >
                        {}
                    </Box>
                </Box>
            </Box>
            {Object.keys(itemList).map((item, index) => (
                <Box className="cards-sub-content" key={index}>
                    <Box className="cards-sub-content-key">{item}</Box>
                    <Box className="cards-sub-content-value">
                        {itemList[item]}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default Orders;
