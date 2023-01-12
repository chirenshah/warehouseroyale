import { Autocomplete, Box } from '@mui/material';
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
  nextRound,
  orderListListerner,
  purchaseInventory,
  returnSku,
  updateOrderList,
} from '../../../../Database/firestore';
import { Timer } from '../../../timer';
import { useNavigate } from 'react-router-dom';

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
  const [sku_list, setskuList] = useState([]);
  const [inventoryQuant, setInventoryQuant] = useState(0);
  const [inventorySku, setInventorySku] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    orderListListerner(setOrderList);
    returnSku(setskuList);
    creatOrderOptions(3).then((data) => {
      setOfferList(data);
    });
  }, []);

  function onExpire() {
    nextRound();
    navigate('/');
  }

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
    purchaseInventory(inventorySku, inventoryQuant);
    setInventoryQuant(0);
    setInventorySku('');
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
                <Timer minutes={20} onExpire={onExpire} />
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
                  <Box
                    id="inventory-purchase"
                    className="inventory-purchase-box"
                  >
                    <Autocomplete
                      sx={{ width: 150, margin: 1 }}
                      options={sku_list}
                      value={inventorySku}
                      renderInput={(params) => (
                        <TextField {...params} label="SkuID"></TextField>
                      )}
                      onChange={(event, val) => {
                        setInventorySku(val);
                      }}
                    ></Autocomplete>
                    <TextField
                      label="Quantity"
                      type="number"
                      sx={{ width: 80, margin: 1 }}
                      value={inventoryQuant}
                      onChange={(event) => {
                        if (event.target.value >= 0) {
                          setInventoryQuant(event.target.value);
                        } else {
                          setInventoryQuant(0);
                        }
                      }}
                    />
                  </Box>
                  <Box className="inventory-purchase-btn-box">
                    <Button
                      className="inventory-purchase-btn"
                      color="purchaseColor"
                      variant="outlined"
                      size="medium"
                      onClick={purchaseBtnClickHandler}
                      disabled={
                        inventorySku === '' || inventoryQuant === 0
                          ? true
                          : false
                      }
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
