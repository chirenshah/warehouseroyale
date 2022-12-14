import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useRef, useEffect } from 'react';
import './../../../../style/ManagerGameLayout.css';

function Offer(props) {
  const ref = useRef(null);
  let title = props['order']['title'];
  let itemList = { ...props.order };
  delete itemList['title'];
  delete itemList['status'];
  // props["data-values"].forEach((item, index) => {
  //     itemList.push(
  //         <Box
  //             id={props["data-id"] + "-item-super-class-" + index}
  //             className="cards-sub-content"
  //             key={index}
  //         >
  //             <Box
  //                 id={props["data-id"] + "-" + index + "-item"}
  //                 className="cards-sub-content-key"
  //             >
  //                 Item {props["data-items"][index]}
  //             </Box>
  //             <Box
  //                 id={props["data-id"] + "-" + index + "-value"}
  //                 className="cards-sub-content-value"
  //             >
  //                 {item}
  //             </Box>
  //         </Box>
  //     );
  // });

  // function clickHandler(e) {
  //     e.stopPropagation();
  //     let tempID = e.target.id;
  //     let elementID;

  //     if (tempID.includes("item-super-class")) {
  //         elementID = e.target.parentNode.id;
  //     } else if (tempID.includes("item")) {
  //         elementID = e.target.parentNode.parentNode.id;
  //     } else if (tempID.includes("value")) {
  //         elementID = e.target.parentNode.parentNode.id;
  //     } else if (tempID.includes("card-heading")) {
  //         elementID = e.target.parentNode.id;
  //     } else {
  //         elementID = e.target.id;
  //     }

  //     let element = document.getElementById(`${elementID}`);
  //     let offer_name = element.getAttribute("data-offer-name");
  //     let no_of_items = element.getAttribute("data-number-of-offers-items");
  //     let values = element.getAttribute("data-values").split(",");
  //     let items = element.getAttribute("data-items").split(",");

  //     for (let itr = 0; itr < values.length; itr++) {
  //         values[itr] = parseInt(values[itr]);
  //     }

  //     let tempObj = {};

  //     tempObj["data-offer-name"] = offer_name;
  //     tempObj["data-number-of-offers-items"] = no_of_items;
  //     tempObj["data-values"] = values;
  //     tempObj["data-items"] = items;

  //     if (!props["disableDataFetch"]) {
  //         props.getOfferData(tempObj);

  //         for (
  //             let itr = 0;
  //             itr < document.getElementsByClassName("offer-cards").length;
  //             itr++
  //         ) {
  //             document
  //                 .getElementsByClassName("offer-cards")
  //                 [itr].classList.add("unselected-offer-card");
  //             document
  //                 .getElementsByClassName("offer-cards")
  //                 [itr].classList.remove("selected-offer-card");
  //         }

  //         element.classList.remove("unselected-offer-card");
  //         element.classList.add("selected-offer-card");
  //     }
  // }

  return (
    <div
      onClick={() =>
        props.getSelectedOffer((prev) => {
          if (prev && prev[0].current) {
            prev[0].current.classList.remove('selected-offer-card');
          }
          ref.current.classList.remove('unselected-offer-card');
          ref.current.classList.add('selected-offer-card');
          return [ref, props['index']];
        })
      }
    >
      <Box ref={ref} className="offer-cards unselected-offer-card">
        <Box className="card-heading">{title}</Box>
        {Object.keys(itemList).map((item, index) => (
          <Box key={index} className="cards-sub-content">
            <Box className="cards-sub-content-key">{item}</Box>:
            <Box className="cards-sub-content-value">
              {props['order'][item]}
            </Box>
          </Box>
        ))}
      </Box>
    </div>

    // <Box
    //     id={props["data-id"]}
    //     data-offer-name={props["data-offer-name"]}
    //     data-number-of-offers-items={props["data-number-of-offers-items"]}
    //     data-values={props["data-values"]}
    //     data-items={props["data-items"]}
    //     className="offer-cards unselected-offer-card"
    //     onClick={clickHandler}
    // >
    //     <Box
    //         id={props["data-id"] + "-card-heading"}
    //         className="card-heading"
    //     >
    //         {props["data-offer-name"]}
    //     </Box>
    //     {itemList}
    // </Box>
  );
}

export default Offer;
