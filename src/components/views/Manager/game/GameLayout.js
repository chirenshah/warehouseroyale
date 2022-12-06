import { Box } from '@mui/material';
import React from 'react';
import { useState, useEffect } from 'react';
import "./../../../../style/ManagerGameLayout.css";
import Offer from './Offer';
import Orders from './Orders';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const theme = createTheme({
    palette: {
      neutral: {
        main: '#5D5FEF',
        contrastText: '#fff',
      },
      purchaseColor: {
        main: '#13132A',
        contrastText: '#000',
      },
    },
  });

function GameLayout() {
    const [selectedOffer, setSelectedOffer] = useState({});
    const [isAnyOfferSelected, setIsAnyOfferSelected] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [selectBtnDisabled, setSelectBtnDisabled] = useState(true);
    const [itemXValue, setItemXValue] = useState(0);
    const [itemYValue, setItemYValue] = useState(0);
    const [itemZValue, setItemZValue] = useState(0);
    const [inventoryBtnDisabled, setInventoryBtnDisabled] = useState(true);
    // const [inventoryPurchase, setInventoryPurchase] = useState({"itemX" : 0, "itemY" : 0, "itemZ" : 0});
    
    
    function getSelectedOffer (obj) {
        setSelectedOffer(obj);
        setSelectBtnDisabled(false);
        setIsAnyOfferSelected(true);
    }

    function selectBtnClickHandler(e) {
        e.stopPropagation();

        setOrderList([
            ...orderList,
            <Orders 
                key={orderList.length}
                data-id={'order-' + Date.now()}
                data-offer-name={`Order ${orderList.length + 1}`}
                data-number-of-offers-items={selectedOffer['data-number-of-offers-items']}
                data-values={selectedOffer['data-values']}
                data-items={selectedOffer['data-items']}
            />
        ]);
    }
    
    function purchaseBtnClickHandler(e) {
        let object = {};
        object["data-offer-name"] = `Order ${orderList.length + 1}`;
        object["data-values"] = [];
        object["data-items"] = [];

        let count = 0;
        if (itemXValue != 0) {
            object["data-items"].push("X")
            object["data-values"].push(itemXValue)
            count += 1;
        }
        if (itemYValue != 0) {
            object["data-items"].push("Y")
            object["data-values"].push(itemYValue)
            count += 1;
        }
        if (itemZValue != 0) {
            object["data-items"].push("Z")
            object["data-values"].push(itemZValue)
            count += 1;
        }
        object["data-number-of-offers-items"] = count;

        setOrderList([
            ...orderList,
            <Orders 
                key={orderList.length}
                data-id={'order-' + Date.now()}
                data-offer-name={object['data-offer-name']}
                data-number-of-offers-items={object['data-number-of-offers-items']}
                data-values={object['data-values']}
                data-items={object['data-items']}
            />
        ]);
    }

    function checkForPositiveValue(value, item) {
        if (value.trim().length != 0) {
            let val = parseInt(value);
            if (val <= 0) {
                if (item === "X") {
                    setItemXValue(0);
                    if (itemYValue === 0 && itemZValue === 0) {
                        setInventoryBtnDisabled(true)
                    }
                } else if (item === "Y") {
                    setItemYValue(0);
                    if (itemXValue === 0 && itemZValue === 0) {
                        setInventoryBtnDisabled(true)
                    }
                } else if (item === "Z") {
                    setItemZValue(0);
                    if (itemXValue === 0 && itemYValue === 0) {
                        setInventoryBtnDisabled(true)
                    }
                }
            } else {
                if (item === "X") {
                    setItemXValue(val);
                } else if (item === "Y") {
                    setItemYValue(val);
                } else if (item === "Z") {
                    setItemZValue(val);
                }
                setInventoryBtnDisabled(false);
            }
        } else {
            if (item === "X") {
                setItemXValue("");
                if (itemYValue === 0 && itemZValue === 0) {
                    setInventoryBtnDisabled(true)
                }
            } else if (item === "Y") {
                setItemYValue("");
                if (itemXValue === 0 && itemZValue === 0) {
                    setInventoryBtnDisabled(true)
                }
            } else if (item === "Z") {
                setItemZValue("");
                if (itemXValue === 0 && itemYValue === 0) {
                    setInventoryBtnDisabled(true)
                }
            }
        }
        
    }

    return (
        <ThemeProvider theme={theme}>
            <Box className='game-layout'>
                <Box className="content-manager-page">
                    <Box id="manager-content-1" className="manager-content-1 manager-content manager-content-display">
                        <Box id="cards-div-offer" className="cards-div cards-div-offer">
                            <Box id="offer-cards-inner-div" className="offer-cards-inner-div">
                                <Box id="offer-cards-inner-padding-div" className="offer-cards-inner-padding-div">
                                    <Offer 
                                        data-id={"Offer-1-" + Date.now()} 
                                        data-offer-name="Offer 1" 
                                        data-number-of-offers-items="1" 
                                        data-values={[200]} 
                                        data-items={["X"]} 
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    />
                                    <Offer 
                                        data-id={"Offer-2-" + Date.now()} 
                                        data-offer-name="Offer 1" 
                                        data-number-of-offers-items="1" 
                                        data-values={[200]} 
                                        data-items={["X"]} 
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    />
                                    <Offer 
                                        data-id={"Offer-3-" + Date.now()} 
                                        data-offer-name="Offer 2" 
                                        data-number-of-offers-items="2" 
                                        data-values={[35, 20]} 
                                        data-items={["X", "Y"]} 
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    />
                                    <Offer 
                                        data-id={"Offer-4-" + Date.now()} 
                                        data-offer-name="Offer 3" 
                                        data-number-of-offers-items="3" 
                                        data-values={[15, 10, 5]} 
                                        data-items={["X", "Y", "Z"]} 
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    />
                                    <Offer 
                                        data-id={"Offer-5-" + Date.now()} 
                                        data-offer-name="Offer 4" 
                                        data-number-of-offers-items="3" 
                                        data-values={[15, 10, 5]} 
                                        data-items={["X", "Y", "Z"]} 
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    />
                                    <Offer 
                                        data-id={"Offer-6-" + Date.now()} 
                                        data-offer-name="Offer 5" 
                                        data-number-of-offers-items="3" 
                                        data-values={[15, 10, 5]} 
                                        data-items={["X", "Y", "Z"]} 
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    />
                                    <Offer 
                                        data-id={"Offer-7-" + Date.now()} 
                                        data-offer-name="Offer 6" 
                                        data-number-of-offers-items="1" 
                                        data-values={[200]} 
                                        data-items={["X"]} 
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    />
                                    <Offer 
                                        data-id={"Offer-8-" + Date.now()} 
                                        data-offer-name="Offer 7" 
                                        data-number-of-offers-items="2" 
                                        data-values={[35, 20]} 
                                        data-items={["X", "Y"]} 
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    />
                                    <Offer 
                                        data-id={"Offer-9-" + Date.now()} 
                                        data-offer-name="Offer 8" 
                                        data-number-of-offers-items="3" 
                                        data-values={[15, 10, 5]} 
                                        data-items={["X", "Y", "Z"]} 
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    />
                                </Box>
                            </Box>
                            <Box id="offer-cards-inner-btns-div" className="offer-cards-inner-btns-div">
                                <Button 
                                    color="neutral" 
                                    variant="contained" 
                                    size="medium" 
                                    onClick={selectBtnClickHandler}
                                    disabled={selectBtnDisabled}
                                >Select</Button>
                            </Box>
                        </Box>
                        <hr className="horizontal_dotted_line"/>
                        <Box id="cards-div-game-details" className="cards-div cards-div-game-details">
                            <Box className='cards-div-game-details-last-orders'>
                                <Box id="last-orders-inner-div" className="game-details-card-div last-orders-inner-div">
                                    <Box id="last-orders-heading" className="game-details-card-heading last-orders-heading">
                                        LAST ORDERS
                                    </Box>
                                    <Box id='orders-list-div' className='orders-list-div'>
                                        {orderList}
                                    </Box>
                                </Box>
                            </Box>
                            <Box className='cards-div-game-details-verticle-separation'></Box>
                            <Box className='cards-div-game-details-performance-metric'>
                                <Box id="" className="game-details-card-div ">
                                    <Box id="" className="game-details-card-heading ">
                                        PERFORMANCE METRICS
                                    </Box>
                                </Box>
                            </Box>
                            <Box className='cards-div-game-details-verticle-separation'></Box>
                            <Box className='cards-div-game-details-select-order'>
                                <Box id="game-details-card-div" className="game-details-card-div ">
                                    <Box id="game-details-card-heading" className="game-details-card-heading ">
                                        INVENTORY PURCHASE
                                    </Box>
                                    {/* {displaySelectedOffer()} */}
                                    <Box id="inventory-purchase" className="inventory-purchase-box">
                                        <Box id="" className="cards-sub-content">
                                            <Box id="" className="cards-sub-content-key">Item X</Box>
                                            <TextField 
                                                className='inventory-text-field' 
                                                variant="standard" 
                                                size='small'
                                                type="number"
                                                value={itemXValue}
                                                InputProps={{ inputProps: { min: 1 } }}
                                                onChange={(e) => {
                                                    checkForPositiveValue(e.target.value, "X");
                                                }}
                                            />
                                        </Box>
                                        <Box id="" className="cards-sub-content">
                                            <Box id="" className="cards-sub-content-key">Item Y</Box>
                                            <TextField 
                                                className='inventory-text-field' 
                                                variant="standard" 
                                                size='small'
                                                type="number"
                                                value={itemYValue}
                                                InputProps={{ inputProps: { min: 1 } }}
                                                onChange={(e) => {
                                                    checkForPositiveValue(e.target.value, "Y");
                                                }}
                                            />
                                        </Box>
                                        <Box id="" className="cards-sub-content">
                                            <Box id="" className="cards-sub-content-key">Item Z</Box>
                                            <TextField 
                                                className='inventory-text-field' 
                                                variant="standard" 
                                                size='small'
                                                type="number"
                                                value={itemZValue}
                                                InputProps={{ inputProps: { min: 1 } }}
                                                onChange={(e) => {
                                                    checkForPositiveValue(e.target.value, "Z");
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box className='inventory-purchase-btn-box'>
                                        <Button 
                                            className='inventory-purchase-btn'
                                            color="purchaseColor" 
                                            variant="outlined" 
                                            size="medium" 
                                            onClick={purchaseBtnClickHandler}
                                            disabled={inventoryBtnDisabled}
                                        >Purchase</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <hr className="horizontal_dotted_line"/>
                        <Box id="cards-div-chat-box" className="cards-div cards-div-chat-box">
                            <Box id="cards-inner-div-push-order" className="selected-offer-cards-inner-div cards-inner-div-push-order">
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default GameLayout