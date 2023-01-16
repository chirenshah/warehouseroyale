import Bins from './bins';
import barcode from '../assets/barcode.svg';
import '../style/employee_game.css';
import Sku from './sku';
import React, { useState, createRef, useEffect } from 'react';
import {
  binListener,
  calculateLogs,
  calculateScore,
  fetchStartTime,
  nextRound,
  updateIRI,
  updateLogs,
  updateOrderList,
} from '../Database/firestore';
// import { room, sendMessage, cursorListner } from "./webRTC";
import { Outlet, useNavigate } from 'react-router-dom';
import { AiOutlineSend } from 'react-icons/ai';
import { ChatBox } from './chatBox';
import { BiRightArrow, BiDownArrow, BiLeftArrow } from 'react-icons/bi';

import { Trash } from './trash';
import { SkuFinderScreen } from './skuFinderScreen';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { Timer } from './timer';
export default function Game() {
  var label = '';
  var from = createRef();
  var to = createRef();
  var sku = createRef();
  var quant = createRef();
  var chatRef = createRef();
  let navigate = useNavigate();
  // Low medium and high complexity for data
  // low is the numbering is ordered
  // medium is when you need to check more digits
  // hard is last 3 or 4 digits are same and middle would be different

  // A - l ~ fast normal distribution  m - z ~ slow normal distribution
  //   (x//2) +- 20%                            x +- 10%
  //admin can influence the time by default its 10 mins

  //prepopulation
  //None :
  //Some :
  //many :

  //TODO
  //2. Identifier for different user's in chat
  //3. Ability to reference sku's
  //4. Search for sku based on physical records
  //5. Chat box should resizable and should send on enter
  //6. the expiry timer should be some percent of the total game time.
  //7. Make a trash bin for expired sku's.
  //8. Clean up the code.
  //9.
  //10. Make perishable and non perishable items.

  const [skuSelected, setskuSelected] = useState();
  //const [coord, setcoord] = useState([]);
  const [sku_data, setSku_data] = useState({ Receiving: [] });
  const [orderList, setorderList] = useState([[]]);
  const [selectedOrders, setselectedOrders] = useState({ O1: {}, O2: {} });
  const [chat, setChat] = useState(true);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState();
  const [showScreen, SetshowScreen] = useState(false);

  useEffect(() => {
    binListener(setSku_data, setorderList, setselectedOrders);
    console.log(orderList);
  }, []);

  function chooseSelected(reference) {
    if (selected) {
      selected.classList = '';
    }
    setSelected(reference.current);
    reference.current.classList = 'selected';
  }
  function updateSelected(label) {
    if (selected) {
      if (label === 'O1') {
        label = 'Order 1';
      } else if (label === 'O2') {
        label = 'Order 2';
      }
      selected.childNodes[1].value = label;
      selected.classList = '';
    }
  }

  const bins = Array.from({ length: 16 }, (_, index) => {
    if (index < 4) {
      label = 'A' + (index + 1).toString();
    } else if (index < 8) {
      label = 'B' + (index - 3).toString();
    } else if (index < 12) {
      label = 'C' + (index - 7).toString();
    } else {
      label = 'D' + (index - 11).toString();
    }
    if (!(label in sku_data)) {
      sku_data[label] = [];
    }
    return (
      <Bins
        key={index}
        binId={label}
        updateSelected={updateSelected}
        setSku={setskuSelected}
        data={sku_data[label]}
        set_data={setSku_data}
      ></Bins>
    );
  });

  function onExpire() {
    updateIRI();
    navigate('/');
  }

  return (
    <div style={{ overflowX: 'hidden' }}>
      <section className="inventory">
        <div className="barcode">
          <img
            alt="barcode"
            src={barcode}
            onClick={() => {
              updateSelected('Receiving');
            }}
          ></img>
          <h3>RECEIVING</h3>
        </div>
        <div className="sku_container">
          {sku_data['Receiving'].map((value, key) => (
            <Sku
              key={key}
              id={Object.keys(value)[0]}
              parent={'Receiving'}
              setSku={setskuSelected}
              expiretime={value[Object.keys(value)]}
            />
          ))}
        </div>
        <div className="orderList">
          {orderList.map(
            (element, idx) =>
              element['status'] === 'Not Selected' && (
                <div key={idx} className="orderList-content">
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<BiDownArrow />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        Points : <span>{element['Points']}</span>
                      </Typography>
                    </AccordionSummary>
                    <button
                      className="submit-btn"
                      style={{ width: '70%', margin: 0 }}
                      onClick={() => {
                        if (Object.keys(selectedOrders['O1']).length === 0) {
                          let temp = selectedOrders;
                          temp['O1'] = element;
                          // setselectedOrders(temp);
                          orderList[idx]['status'] = 'Selected';
                          updateOrderList(orderList, idx, 'O1');
                        } else if (
                          Object.keys(selectedOrders['O2']).length === 0
                        ) {
                          let temp = selectedOrders;
                          temp['O2'] = element;
                          // setselectedOrders(temp);
                          updateOrderList(element, 'O2');
                        } else {
                          alert("Previous order's need to be completed");
                        }
                      }}
                    >
                      select
                    </button>
                    <AccordionDetails>
                      {Object.keys(element).map((key, id) => {
                        if (
                          key === 'Points' ||
                          key === 'title' ||
                          key === 'status'
                        ) {
                          return '';
                        } else {
                          return (
                            <div className="cards" key={id}>
                              <p
                                style={{
                                  margin: 0,
                                }}
                              >
                                {key}:<span>{element[key]}</span>
                              </p>
                            </div>
                          );
                        }
                      })}
                    </AccordionDetails>
                  </Accordion>
                </div>
              )
          )}
        </div>
      </section>
      <section className="center">
        <div className="bins">{bins}</div>
        <div className="carts">
          <div>
            <Bins
              binId={'O1'}
              selected={selected}
              updateSelected={updateSelected}
              setSku={setskuSelected}
              data={sku_data['O1']}
              set_data={setSku_data}
            ></Bins>
            <button
              className="send-btn"
              onClick={() => {
                calculateScore(selectedOrders['O1'], sku_data['O1'], 'O1');
              }}
            >
              Send {selectedOrders['O1']['title']}
            </button>
          </div>

          <div className="order">
            <p>{selectedOrders['O1']['title']} </p>
            <div className="order-content">
              {Object.keys(selectedOrders['O1']).map((value, key) => {
                if (
                  value !== 'Points' &&
                  value !== 'title' &&
                  value !== 'status'
                ) {
                  return (
                    <div className="cards" key={key}>
                      {value} :{selectedOrders['O1'][value]}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div>
            <Bins
              binId={'O2'}
              selected={selected}
              updateSelected={updateSelected}
              setSku={setskuSelected}
              data={sku_data['O2']}
              set_data={setSku_data}
            ></Bins>
            <button
              className="send-btn"
              onClick={() => {
                calculateScore(selectedOrders['O2'], sku_data['O2'], 'O2');
              }}
            >
              Send {selectedOrders['O2']['title']}
            </button>
          </div>
          <div className="order">
            <p>{selectedOrders['O2']['title']}</p>
            <div className="order-content">
              {Object.keys(selectedOrders['O2']).map((value, key) => {
                if (
                  value !== 'Points' &&
                  value !== 'title' &&
                  value !== 'status'
                ) {
                  return (
                    <div className="cards" key={key}>
                      {value} :{selectedOrders['O2'][value]}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="record">
        <div className="scan_container">
          <h3>RECORD</h3>
          <hr></hr>
          <div className="form">
            <label
              ref={from}
              onClick={() => {
                chooseSelected(from);
              }}
            >
              FROM LOCATION - <input type="text" name="from" />
            </label>
            <label ref={to} onClick={() => chooseSelected(to)}>
              TO LOCATION - <input type="text" name="to" />
            </label>
            <label ref={sku} onClick={() => chooseSelected(sku)}>
              SKU - <input type="text" name="sku" />
            </label>
            <label ref={quant} onClick={() => chooseSelected(quant)}>
              Quantity - <input type="text" name="quant" />
            </label>
            <button
              className="submit-btn"
              onClick={() => {
                let fromValue = from.current.childNodes[1].value;
                let toValue = to.current.childNodes[1].value;
                let skuId = sku.current.childNodes[1].value;
                let quantVal = quant.current.childNodes[1].value;

                updateLogs(fromValue, toValue, skuId, parseInt(quantVal));
                from.current.childNodes[1].value = '';
                to.current.childNodes[1].value = '';
                sku.current.childNodes[1].value = '';
                quant.current.childNodes[1].value = 1;
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="record_call_to_action">
          <img
            alt="barcode"
            src={barcode}
            style={{
              opacity: skuSelected ? 1 : 0.1,
            }}
            onClick={() => {
              if (skuSelected) {
                sku.current.childNodes[1].value = skuSelected;
                sku.current.classList = '';
              }
            }}
          ></img>
          <br></br>
          {skuSelected}
          {showScreen ? (
            <SkuFinderScreen SetshowScreen={SetshowScreen} />
          ) : null}
          <button
            className="send-btn black"
            onClick={() => {
              SetshowScreen(true);
            }}
          >
            FIND SKU
          </button>
          <br></br>
          <Timer minutes={20} onExpire={onExpire} />
          <Trash updateSelected={updateSelected} setSku_data={setSku_data} />
          <div className="chat-container" draggable ref={chatRef}>
            <button
              className={'submit-btn chat'}
              onClick={() => {
                setChat((prev) => !prev);
              }}
            >
              {chat ? 'Chat' : 'x'}
            </button>
            <ChatBox expand={chat} />
          </div>
        </div>
      </section>
    </div>
  );
}
