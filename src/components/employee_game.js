import Bins from "./bins";
import barcode from "../assets/barcode.svg";
import "../style/employee_game.css";
import Sku from "./sku";
import React, { useState, createRef, useEffect } from "react";
import {
    binListener,
    calculateLogs,
    calculateScore,
    chat_sendMessage,
    createOrders,

    // flushbins,
    // updateCursor,
    updateLogs,
    updateOrderList,
    writeInventory,
} from "../Database/firestore";
// import { room, sendMessage, cursorListner } from "./webRTC";
import { Outlet, useNavigate } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import { ChatBox } from "./chatBox";
import { BiRightArrow, BiDownArrow } from "react-icons/bi";

import { Trash } from "./trash";
import { SkuFinderScreen } from "./skuFinderScreen";
export default function Game() {
    var label = "";
    var from = createRef();
    var to = createRef();
    var sku = createRef();
    var quant = createRef();
    var chatRef = createRef();
    //let navigate = useNavigate();
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
    const [message, setMessage] = useState("");
    const [timer, settimer] = useState("19:00");
    const [selected, setSelected] = useState({});
    const [showScreen, SetshowScreen] = useState(false);
    const [StartTime, setStartTime] = useState(new Date());
    const [animate_id, setanimate_id] = useState();

    useEffect(() => {
        binListener(setSku_data, setorderList, setStartTime, setselectedOrders);
        //writeInventory();
        //createOrders(setorderList, sku_data);
        //cursorListner(setcoord);
        //room();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const timeObject = new Date();
            let minute;
            if (timer !== "00:00" && timer !== "Expired") {
                let diff = (timeObject.getTime() - StartTime) / 1000;
                if (diff <= 0) {
                    alert("Game hasn't started yet");
                    settimer(() => "Expired");
                } else {
                    let minuteInt = 20 - parseInt(diff / 60, 10);
                    if (minuteInt < 0) {
                        settimer(() => "Expired");
                    } else {
                        let seconds = parseInt(diff % 60, 10);
                        seconds = 59 - seconds;
                        if (minuteInt < 10) {
                            minute = "0" + minuteInt;
                        } else {
                            minute = minuteInt + "";
                        }
                        if (seconds < 10) seconds = "0" + seconds;
                        settimer(minute + ":" + seconds);
                    }
                }
            } else {
                // let score = calculateLogs();
                // score.then((val) => {
                //     // navigate(
                //     //     "/performancemetric/" + val.right + "/" + val.wrong
                //     // );
                // });
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [timer]);
    // const handleWindowMouseMove = (event) => {
    //     var now = Date.now();
    //     if (now % 20 === 0) {
    //         sendMessage(event.clientX, event.clientY);
    //     }
    // };
    //window.addEventListener("mousemove", handleWindowMouseMove);

    function chooseSelected(reference) {
        if (selected) {
            selected.classList = "";
        }
        setSelected(reference.current);
        reference.current.classList = "selected";
    }
    function updateSelected(label) {
        if (selected) {
            if (label === "O1") {
                label = "Order 1";
            } else if (label === "O2") {
                label = "Order 2";
            }
            selected.childNodes[1].value = label;
            selected.classList = "";
        }
    }

    const bins = Array.from({ length: 16 }, (_, index) => {
        if (index < 4) {
            label = "A" + (index + 1).toString();
        } else if (index < 8) {
            label = "B" + (index - 3).toString();
        } else if (index < 12) {
            label = "C" + (index - 7).toString();
        } else {
            label = "D" + (index - 11).toString();
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
    return (
        <div>
            {/* <div
          style={{
            position: "absolute",
            top: coord["y"],
            left: coord["x"],
            backgroundColor: "red",
            color: "red",
          }}
        >
          x
        </div> */}
            <section className="inventory">
                <div className="barcode">
                    <img
                        alt="barcode"
                        src={barcode}
                        onClick={() => {
                            updateSelected("Receiving");
                        }}
                    ></img>
                    <h3>RECEIVING</h3>
                </div>
                <div className="sku_container">
                    {sku_data["Receiving"].map((value, key) => (
                        <Sku
                            key={key}
                            id={Object.keys(value)[0]}
                            parent={"Receiving"}
                            setSku={setskuSelected}
                            expiretime={value[Object.keys(value)]}
                        />
                    ))}
                </div>
                <div className="orderList">
                    {orderList.map((element, idx) => (
                        <div key={idx} className="orderList-content">
                            <BiRightArrow
                                style={{
                                    transform:
                                        idx !== animate_id
                                            ? "rotate(0deg)"
                                            : "rotate(90deg)",
                                    transition: "ease-in 0.5s transform",
                                    float: "left",
                                    margin: "10px 10px",
                                }}
                                onClick={() => {
                                    setanimate_id((prev) =>
                                        prev === idx ? -1 : idx
                                    );
                                }}
                            ></BiRightArrow>
                            <p style={{ margin: 0 }}>
                                Points : <span>{element["amount"]}</span>
                            </p>
                            <button
                                className="submit-btn"
                                style={{ width: "70%", margin: 0 }}
                                onClick={() => {
                                    console.log(selectedOrders["O1"]);
                                    if (
                                        Object.keys(selectedOrders["O1"])
                                            .length === 0
                                    ) {
                                        let temp = selectedOrders;
                                        temp["O1"] = element;
                                        //delete temp["O1"]["amount"];
                                        setselectedOrders(temp);
                                        updateOrderList(element, "O1");
                                        //setorderList(temp);
                                    } else if (
                                        Object.keys(selectedOrders["O2"])
                                            .length === 0
                                    ) {
                                        let temp = selectedOrders;
                                        temp["O2"] = element;
                                        //delete temp["O2"]["amount"];
                                        updateOrderList(
                                            orderList,
                                            element,
                                            "O2"
                                        );
                                    } else {
                                        alert(
                                            "Previous order's need to be completed"
                                        );
                                    }
                                }}
                            >
                                select
                            </button>
                            <div
                                className={
                                    animate_id === idx ? "grow" : "shrink"
                                }
                            >
                                {Object.keys(element).map((key, id) => {
                                    if (key === "amount") {
                                        return "";
                                    } else {
                                        return (
                                            <div className="cards" key={id}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                    }}
                                                >
                                                    {key}:
                                                    <span>{element[key]}</span>
                                                </p>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="center">
                <div className="bins">{bins}</div>
                <div className="carts">
                    <div>
                        <Bins
                            binId={"O1"}
                            selected={selected}
                            updateSelected={updateSelected}
                            setSku={setskuSelected}
                            data={sku_data["O1"]}
                            set_data={setSku_data}
                        ></Bins>
                        <button
                            className="send-btn"
                            onClick={() => {
                                calculateScore(
                                    selectedOrders["O1"],
                                    sku_data["O1"],
                                    "O1"
                                );
                            }}
                        >
                            Send Order 1
                        </button>
                    </div>

                    <div className="order">
                        <p>Order 1 </p>
                        <div className="order-content">
                            {Object.keys(selectedOrders["O1"]).map(
                                (value, key) => {
                                    if (value !== "amount") {
                                        return (
                                            <div className="cards" key={key}>
                                                {value} :
                                                {selectedOrders["O1"][value]}
                                            </div>
                                        );
                                    }
                                }
                            )}
                        </div>
                    </div>
                    <div>
                        <Bins
                            binId={"O2"}
                            selected={selected}
                            updateSelected={updateSelected}
                            setSku={setskuSelected}
                            data={sku_data["O2"]}
                            set_data={setSku_data}
                        ></Bins>
                        <button
                            className="send-btn"
                            onClick={() => {
                                calculateScore(
                                    setselectedOrders,
                                    selectedOrders["O2"],
                                    sku_data["O2"],
                                    "O2"
                                );
                            }}
                        >
                            Send Order 2
                        </button>
                    </div>
                    <div className="order">
                        <p>Order 2 </p>
                        <div className="order-content">
                            {Object.keys(selectedOrders["O2"]).map(
                                (value, key) => {
                                    if (value !== "amount") {
                                        return (
                                            <div className="cards" key={key}>
                                                {value} :
                                                {selectedOrders["O2"][value]}
                                            </div>
                                        );
                                    }
                                }
                            )}
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
                        <label
                            ref={quant}
                            onClick={() => chooseSelected(quant)}
                        >
                            Quantity - <input type="text" name="quant" />
                        </label>
                        <br></br>
                        <button
                            className="submit-btn"
                            onClick={() => {
                                let fromValue =
                                    from.current.childNodes[1].value;
                                let toValue = to.current.childNodes[1].value;
                                let skuId = sku.current.childNodes[1].value;
                                let quantVal =
                                    quant.current.childNodes[1].value;

                                updateLogs(
                                    fromValue,
                                    toValue,
                                    skuId,
                                    parseInt(quantVal)
                                );
                                from.current.childNodes[1].value = "";
                                to.current.childNodes[1].value = "";
                                sku.current.childNodes[1].value = "";
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
                                sku.current.classList = "";
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
                    <button
                        className="send-btn white"
                        onClick={() => {
                            let score = calculateLogs();
                            score.then((val) => {
                                // navigate(
                                //     "/performancemetric/" +
                                //         val.right +
                                //         "/" +
                                //         val.wrong
                                // );
                            });

                            // window.removeEventListener(
                            //     "mousemove",
                            //     handleWindowMouseMove
                            // );
                        }}
                    >
                        Finish Game
                    </button>
                    <br></br>
                    {timer}
                    <Trash
                        updateSelected={updateSelected}
                        setSku_data={setSku_data}
                    />
                    {/* {console.log(DragData)} */}
                    <div className="chat-container" draggable ref={chatRef}>
                        <button
                            className={"submit-btn chat"}
                            onClick={() => {
                                setChat((prev) => !prev);
                            }}
                        >
                            {chat ? "Chat" : "x"}
                        </button>
                        <ChatBox expand={chat} />
                        {!chat ? (
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                <input
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                    }}
                                    value={message}
                                    placeholder="say something nice"
                                />
                                <AiOutlineSend
                                    width={10}
                                    fontSize={30}
                                    color="#6649b8"
                                    onClick={() => {
                                        chat_sendMessage(message);
                                        setMessage("");
                                    }}
                                ></AiOutlineSend>
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        </div>
    );
}
