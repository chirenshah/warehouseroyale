import Bins from "./bins";
import barcode from "../assets/barcode.svg";
import "../style/employee_game.css";
import Sku from "./sku";
import { useState, createRef, useEffect } from "react";
import unsub, {
    binListener,
    calculateLogs,
    createOrders,
    flushbins,
    updateCursor,
    updateLogs,
    writeInventory,
} from "../Database/firestore";
import { room, sendMessage, cursorListner } from "./webRTC";
import { useNavigate } from "react-router-dom";
export default function Game() {
    var label = "";
    var from = createRef();
    var to = createRef();
    var sku = createRef();
    var selected;
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
    const [sku_list, setSkuList] = useState([]);
    const [skuSelected, setskuSelected] = useState("");
    const [coord, setcoord] = useState([]);
    const [sku_data, setSku_data] = useState({ O1: {}, O2: {} });
    useEffect(() => {
        binListener(setSku_data, setSkuList);
        //writeInventory();
        //cursorListner(setcoord);
        //room();
    }, []);
    const handleWindowMouseMove = (event) => {
        var now = Date.now();
        if (now % 20 === 0) {
            sendMessage(event.clientX, event.clientY);
        }
    };
    window.addEventListener("keydown", (event) => {
        if (event.metaKey && event.key == "f") {
            event.preventDefault();
        }
    });
    //window.addEventListener("mousemove", handleWindowMouseMove);
    const duplidata = Object.keys(sku_list).slice(0, 12);
    const orders = Array.from({ length: 10 }, (_, index) => {
        return (
            <div className="cards" key={index}>
                {duplidata[index]}
            </div>
        );
    });
    function sendorder(label) {
        let tmp = sku_data;
        tmp[label] = [];
        flushbins(tmp);
    }
    function chooseSelected(reference) {
        if (selected) {
            selected.current.classList = "";
        }
        selected = reference;
        selected.current.classList = "selected";
    }
    function updateSelected(label) {
        if (selected) {
            if (label === "O1") {
                label = "Order 1";
            } else if (label === "O2") {
                label = "Order 2";
            }
            selected.current.childNodes[1].value = label;
            selected.current.classList = "";
        }
    }
    function setSku(id) {
        setskuSelected(id);
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
            sku_data[label] = {};
        }
        return (
            <Bins
                key={index}
                binId={label}
                updateSelected={updateSelected}
                setSku={setskuSelected}
                data={sku_data[label]}
                set_data={setSku_data}
                setSkuList={setSkuList}
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
                        onClick={() => updateSelected("Inventory")}
                    ></img>
                    <h3>RECEIVING</h3>
                </div>
                <div className="sku_container">
                    {Object.keys(sku_list).map((value, key) => (
                        <Sku
                            key={key}
                            id={value}
                            parent={"Inventory"}
                            setSku={setSku}
                            expiretime={sku_list[value]}
                        />
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
                            setSkuList={setSkuList}
                        ></Bins>
                        <button
                            className="send-btn"
                            onClick={() => {
                                sendorder("O1");
                                //createOrders();
                            }}
                        >
                            Send Order 1
                        </button>
                    </div>

                    <div className="order">
                        <p>Order 1 </p>
                        <div className="order-content">{orders}</div>
                    </div>
                    <div>
                        <Bins
                            binId={"O2"}
                            updateSelected={updateSelected}
                            data={sku_data["O2"]}
                            set_data={setSku_data}
                            setSkuList={setSkuList}
                        ></Bins>
                        <button
                            className="send-btn"
                            onClick={() => {
                                sendorder("O2");
                                //createOrders();
                            }}
                        >
                            Send Order 2
                        </button>
                    </div>
                    <div className="order">
                        <p>Order 1</p>
                        <div className="cards">
                            123144 : <b>5</b>
                        </div>
                        <div className="cards">
                            123131 : <b>3</b>
                        </div>
                        <div className="cards">
                            123131 : <b>4</b>
                        </div>
                    </div>
                </div>
            </section>
            <section className="record">
                <div className="scan_container">
                    <h3>RECORD</h3>
                    <hr></hr>
                    <div className="form">
                        <label ref={from} onClick={() => chooseSelected(from)}>
                            FROM LOCATION - <input type="text" name="from" />
                        </label>
                        <label ref={to} onClick={() => chooseSelected(to)}>
                            TO LOCATION - <input type="text" name="to" />
                        </label>
                        <label ref={sku} onClick={() => chooseSelected(sku)}>
                            SKU - <input type="text" name="sku" />
                        </label>
                        {/* <label >
              Quantity - <input type="text" name="sku" />
            </label> */}
                        <br></br>
                        <button
                            className="submit-btn"
                            onClick={() => {
                                let fromValue =
                                    from.current.childNodes[1].value;
                                let toValue = to.current.childNodes[1].value;
                                let skuId = sku.current.childNodes[1].value;
                                updateLogs(fromValue, toValue, skuId);
                                from.current.childNodes[1].value = "";
                                to.current.childNodes[1].value = "";
                                sku.current.childNodes[1].value = "";
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
                    {skuSelected}
                    <button
                        className="send-btn white"
                        onClick={() => {
                            //navigate("/performancemetric");
                            window.removeEventListener(
                                "mousemove",
                                handleWindowMouseMove
                            );
                            calculateLogs();
                        }}
                    >
                        Finish Game
                    </button>
                </div>
            </section>
        </div>
    );
}
