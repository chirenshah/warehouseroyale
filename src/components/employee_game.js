import Bins from "./bins";
import barcode from "../assets/barcode.svg";
import "../style/employee_game.css";
import Sku from "./sku";
import { useState, createRef, useEffect } from "react";
import unsub, { updateCursor } from "../Database/firestore";
import {room,sendMessage,cursorListner} from './webRTC';
import { useNavigate } from "react-router-dom";
export default function Game() {
  var label = "";
  var from = createRef();
  var to = createRef();
  var sku = createRef();
  var selected;
  let expiretime = "00:30"
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
  const data = Array.from(
    { length: 20 },
    () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      "123" +
      Math.floor(Math.random() * 100000).toString()
  );
  const [sku_list, setSkuList] = useState(data);
  const [dellabel, setdelabel] = useState("");
  const [delid, setdelid] = useState("");
  const [skuSelected, setskuSelected] = useState("");
  const [coord, setcoord] = useState([]);
  useEffect(() => {
    cursorListner(setcoord);
    room();
    }, [])

  const handleWindowMouseMove = (event) => {
    var now = Date.now();
    if (now % 20 === 0) {
      sendMessage(event.clientX,event.clientY);
    }
  };
  window.addEventListener("mousemove", handleWindowMouseMove);
  const delsku = (parent, id) => {
    setdelabel(parent);
    setdelid(id);
    setSkuList((prev) => prev.filter((val) => val !== id));
  };
  const duplidata = sku_list.slice(0, 12);
  const orders = Array.from({ length: 10 }, (_, index) => {
    return (
      <div className="cards" key={index}>
        {duplidata[index]}: <b>{Math.floor(Math.random() * 5)}</b>
      </div>
    );
  });
  function sendorder(label) {
    setdelabel(label);
    setdelid("all");
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
    return (
      <Bins
        key={index}
        binId={label}
        delsku={delsku}
        delbinId={dellabel}
        delid={delid}
        updateSelected={updateSelected}
        setSku={setskuSelected}
      ></Bins>
    );
  });
  return (
    <div>
        <div
          style={{
            position: "absolute",
            top: coord["y"],
            left: coord["x"],
            backgroundColor: "red",
            color: "red",
          }}
        >
          {console.log(coord)}x
        </div>
      <section className="inventory">
        <div className="barcode">
          <img
            alt="barcode"
            src={barcode}
            onClick={() => updateSelected("Receiving")}
          ></img>
          <h3>RECEIVING</h3>
        </div>
        <div className="sku_container">
          {sku_list.map((value, key) => (

            <Sku key={key} id={value} parent={""} setSku={setSku} expiretime={expiretime}/>
          ))}
        </div>
      </section>
      <section className="center">
        <div className="bins">{bins}</div>
        <div className="carts">
          <div>
            <Bins
              binId={"O1"}
              delsku={delsku}
              delbinId={dellabel}
              delid={delid}
              selected={selected}
              updateSelected={updateSelected}
              setSku={setskuSelected}
            ></Bins>
            <button className="send-btn" onClick={() => sendorder("O1")}>
              Send Order 2
            </button>
          </div>

          <div className="order">
            <p>Order 1 </p>
            <div className="order-content">{orders}</div>
          </div>
          <div>
            <Bins
              binId={"O2"}
              delsku={delsku}
              delbinId={dellabel}
              delid={delid}
              selected={selected}
              updateSelected={updateSelected}
            ></Bins>
            <button className="send-btn" onClick={() => sendorder("O2")}>
              Send Order 2
            </button>
          </div>
          <div className="order">
            <p>Order 2</p>
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
          <form>
            <label ref={from} onClick={() => chooseSelected(from)}>
              FROM LOCATION - <input type="text" name="from" />
            </label>
            <label ref={to} onClick={() => chooseSelected(to)}>
              TO LOCATION - <input type="text" name="to" />
            </label>
            <label ref={sku} onClick={() => chooseSelected(sku)}>
              SKU - <input type="text" name="sku" />
            </label>
            <label >
              Quantity - <input type="text" name="sku" />
            </label>
            <br></br>
            <input type="submit" value="Submit" className="submit-btn" />
          </form>
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
          <button className="send-btn black" onClick={()=>{
            test(false)
            console.log("created room")
          }}>Create Room</button>
          <button className="send-btn white" onClick={()=>{
            navigate("/performancemetric")
            window.removeEventListener("mousemove",handleWindowMouseMove);
          }}>Finish Game</button>
          <button className="submit-btn chat" onClick={()=>{
            
          }}>Chat</button>
        </div>
      </section>
    </div>
  );
}
