import { Box } from '@mui/material';
import React from 'react';
import { useState, useEffect } from 'react';
import "./../../../../style/ManagerGameLayout.css";
import Offer from './Offer';
import Orders from './Orders';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      neutral: {
        main: '#5D5FEF',
        contrastText: '#fff',
      },
    },
  });

function GameLayout() {
    const [selectedOffer, setSelectedOffer] = useState({});
    const [isAnyOfferSelected, setIsAnyOfferSelected] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [selectBtnDisabled, setSelectBtnDisabled] = useState(true);
    
    
    function getSelectedOffer (obj) {
        setSelectedOffer(obj);
        setSelectBtnDisabled(false);
        setIsAnyOfferSelected(true);
    }

    // function displaySelectedOffer() {
    //     if (isAnyOfferSelected) {
    //         return (
    //             <Offer 
    //                 data-id='selected-offer'
    //                 data-offer-name={selectedOffer['data-offer-name']}
    //                 data-number-of-offers-items={selectedOffer['data-number-of-offers-items']}
    //                 data-values={selectedOffer['data-values']}
    //                 data-items={selectedOffer['data-items']}
    //                 disableDataFetch={true}
    //                 getOfferData={getSelectedOffer}
    //             />
    //         )
    //     }
    // }

    function purchaseBtnClickHandler(e) {
        e.stopPropagation();

        let element = document.getElementById(`selected-offer-purchase-btn`);
        element.classList.add(`dr-clicked`);
        setTimeout(function() {
            setOrderList([
                ...orderList,
                <Orders 
                    key={orderList.length}
                    data-id={'order-' + Date.now()}
                    data-offer-name={selectedOffer['data-offer-name']}
                    data-number-of-offers-items={selectedOffer['data-number-of-offers-items']}
                    data-values={selectedOffer['data-values']}
                    data-items={selectedOffer['data-items']}
                />
            ]);
            element.classList.remove(`dr-clicked`);
        }, 100);

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
                                    onClick={purchaseBtnClickHandler}
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
                                <Box id="" className="game-details-card-div ">
                                    <Box id="" className="game-details-card-heading ">
                                        INVENTORY PURCHASE
                                    </Box>
                                    {/* {displaySelectedOffer()} */}
                                    <Box 
                                        id="selected-offer-purchase-btn" 
                                        className="btn selected-offer-purchase-btn selected-offer-purchase-btn-disabled"
                                        onClick={purchaseBtnClickHandler}
                                    >
                                        <span>Purchase</span>
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