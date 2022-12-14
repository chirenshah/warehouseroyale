import { Box } from '@mui/material';
import React from 'react';
import { useState, useEffect } from 'react';
import './../../../../style/ManagerGameLayout.css';
import Offer from './Offer';
import Orders from './Orders';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import {
  creatOrderOptions,
  orderListListerner,
  updateOrderList,
} from '../../../../Database/firestore';

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
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [itemXValue, setItemXValue] = useState(0);
  const [itemYValue, setItemYValue] = useState(0);
  const [itemZValue, setItemZValue] = useState(0);
  const [inventoryBtnDisabled, setInventoryBtnDisabled] = useState(true);
  useEffect(() => {
    orderListListerner(setOrderList);
    creatOrderOptions(3).then((data) => {
      setOfferList(data);
    });
  }, []);

  function selectBtnClickHandler(e) {
    let idx = selectedOffer[1];
    console.log(selectedOffer[0].current);
    updateOrderList([offerList[idx - 1], ...orderList.slice(0, 5)]);
    selectedOffer[0].current.classList.remove('selected-offer-card');
    setSelectedOffer(null);
    setOfferList((prev) => {
      prev.splice(idx - 1, 1);
      return prev;
    });
    creatOrderOptions(1).then((data) => {
      setOfferList((prev) => {
        return [...prev, ...data];
      });
    });
  }

  function purchaseBtnClickHandler(e) {
    let object = {};
    object['data-offer-name'] = `Order ${orderList.length + 1}`;
    object['data-values'] = [];
    object['data-items'] = [];

    let count = 0;
    if (itemXValue != 0) {
      object['data-items'].push('X');
      object['data-values'].push(itemXValue);
      count += 1;
    }
    if (itemYValue != 0) {
      object['data-items'].push('Y');
      object['data-values'].push(itemYValue);
      count += 1;
    }
    if (itemZValue != 0) {
      object['data-items'].push('Z');
      object['data-values'].push(itemZValue);
      count += 1;
    }
    object['data-number-of-offers-items'] = count;

    setOrderList([
      ...orderList,
      <Orders
        key={orderList.length}
        data-id={'order-' + Date.now()}
        data-offer-name={object['data-offer-name']}
        data-number-of-offers-items={object['data-number-of-offers-items']}
        data-values={object['data-values']}
        data-items={object['data-items']}
      />,
    ]);
  }

  function checkForPositiveValue(value, item) {
    if (value.trim().length != 0) {
      let val = parseInt(value);
      if (val <= 0) {
        if (item === 'X') {
          setItemXValue(0);
          if (itemYValue === 0 && itemZValue === 0) {
            setInventoryBtnDisabled(true);
          }
        } else if (item === 'Y') {
          setItemYValue(0);
          if (itemXValue === 0 && itemZValue === 0) {
            setInventoryBtnDisabled(true);
          }
        } else if (item === 'Z') {
          setItemZValue(0);
          if (itemXValue === 0 && itemYValue === 0) {
            setInventoryBtnDisabled(true);
          }
        }
      } else {
        if (item === 'X') {
          setItemXValue(val);
        } else if (item === 'Y') {
          setItemYValue(val);
        } else if (item === 'Z') {
          setItemZValue(val);
        }
        setInventoryBtnDisabled(false);
      }
    } else {
      if (item === 'X') {
        setItemXValue('');
        if (itemYValue === 0 && itemZValue === 0) {
          setInventoryBtnDisabled(true);
        }
      } else if (item === 'Y') {
        setItemYValue('');
        if (itemXValue === 0 && itemZValue === 0) {
          setInventoryBtnDisabled(true);
        }
      } else if (item === 'Z') {
        setItemZValue('');
        if (itemXValue === 0 && itemYValue === 0) {
          setInventoryBtnDisabled(true);
        }
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {/* {console.log(selectedOffer)} */}
      <Box className="game-layout">
        <Box className="content-manager-page">
          <Box
            id="manager-content-1"
            className="manager-content-1 manager-content manager-content-display"
          >
            <Box id="cards-div-offer" className="cards-div cards-div-offer">
              <Box id="offer-cards-inner-div" className="offer-cards-inner-div">
                <Box
                  id="offer-cards-inner-padding-div"
                  className="offer-cards-inner-padding-div"
                >
                  {offerList.map((offer, index) => (
                    <Offer
                      key={index}
                      order={offer}
                      index={index + 1}
                      getSelectedOffer={setSelectedOffer}
                    />
                  ))}
                  {/* <Offer
                                        data-id={"Offer-9-" + Date.now()}
                                        data-offer-name="Offer 8"
                                        data-number-of-offers-items="3"
                                        data-values={[15, 10, 5]}
                                        data-items={["X", "Y", "Z"]}
                                        disableDataFetch={false}
                                        getOfferData={getSelectedOffer}
                                    /> */}
                </Box>
              </Box>
              <Box
                id="offer-cards-inner-btns-div"
                className="offer-cards-inner-btns-div"
              >
                <Button
                  color="neutral"
                  variant="contained"
                  size="medium"
                  onClick={selectBtnClickHandler}
                  disabled={selectedOffer === null}
                >
                  Select
                </Button>
              </Box>
            </Box>
            <hr className="horizontal_dotted_line" />
            <Box
              id="cards-div-game-details"
              className="cards-div cards-div-game-details"
            >
              <Box className="cards-div-game-details-last-orders">
                <Box
                  id="last-orders-inner-div"
                  className="game-details-card-div last-orders-inner-div"
                >
                  <Box
                    id="last-orders-heading"
                    className="game-details-card-heading last-orders-heading"
                  >
                    LAST ORDERS
                  </Box>
                  <Box id="orders-list-div" className="orders-list-div">
                    {orderList.map((order, index) => (
                      <Orders data={order} key={index} />
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box className="cards-div-game-details-verticle-separation"></Box>
              <Box className="cards-div-game-details-performance-metric">
                <Box id="" className="game-details-card-div ">
                  <Box id="" className="game-details-card-heading ">
                    PERFORMANCE METRICS
                  </Box>
                </Box>
              </Box>
              <Box className="cards-div-game-details-verticle-separation"></Box>
              <Box className="cards-div-game-details-select-order">
                <Box
                  id="game-details-card-div"
                  className="game-details-card-div "
                >
                  <Box
                    id="game-details-card-heading"
                    className="game-details-card-heading "
                  >
                    INVENTORY PURCHASE
                  </Box>
                  {/* {displaySelectedOffer()} */}
                  <Box
                    id="inventory-purchase"
                    className="inventory-purchase-box"
                  >
                    <Box id="" className="cards-sub-content">
                      <Box id="" className="cards-sub-content-key">
                        Item X
                      </Box>
                      <TextField
                        className="inventory-text-field"
                        variant="standard"
                        size="small"
                        type="number"
                        value={itemXValue}
                        InputProps={{
                          inputProps: { min: 1 },
                        }}
                        onChange={(e) => {
                          checkForPositiveValue(e.target.value, 'X');
                        }}
                      />
                    </Box>
                    <Box id="" className="cards-sub-content">
                      <Box id="" className="cards-sub-content-key">
                        Item Y
                      </Box>
                      <TextField
                        className="inventory-text-field"
                        variant="standard"
                        size="small"
                        type="number"
                        value={itemYValue}
                        InputProps={{
                          inputProps: { min: 1 },
                        }}
                        onChange={(e) => {
                          checkForPositiveValue(e.target.value, 'Y');
                        }}
                      />
                    </Box>
                    <Box id="" className="cards-sub-content">
                      <Box id="" className="cards-sub-content-key">
                        Item Z
                      </Box>
                      <TextField
                        className="inventory-text-field"
                        variant="standard"
                        size="small"
                        type="number"
                        value={itemZValue}
                        InputProps={{
                          inputProps: { min: 1 },
                        }}
                        onChange={(e) => {
                          checkForPositiveValue(e.target.value, 'Z');
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className="inventory-purchase-btn-box">
                    <Button
                      className="inventory-purchase-btn"
                      color="purchaseColor"
                      variant="outlined"
                      size="medium"
                      onClick={purchaseBtnClickHandler}
                      disabled={inventoryBtnDisabled}
                    >
                      Purchase
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
            <hr className="horizontal_dotted_line" />
            <Box
              id="cards-div-chat-box"
              className="cards-div cards-div-chat-box"
            >
              <Box
                id="cards-inner-div-push-order"
                className="selected-offer-cards-inner-div cards-inner-div-push-order"
              ></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default GameLayout;
