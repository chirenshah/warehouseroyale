import { useState } from "react";
import { useDrop } from "react-dnd";
import Sku from "./sku";
import "../style/bin.css";
import barcode from "../assets/barcode.svg";
import { binUpdate } from "../Database/firestore";
function Bins({ binId, updateSelected, setSku ,data,set_data,setSkuList}) {
    const [expiretime, setexpiretime] = useState("");
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: "sku",
            drop: (item) => {
                setexpiretime(item["timer"]);
                if (binId !== item["parent"])
                    binUpdate(item["parent"],binId,item['id'],set_data);
                    setSkuList((prev) => prev.filter((val) => val !== item['id']));
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        [binId]
    );


    return (
        <div
            className="bin_body"
            ref={drop}
            style={{
                opacity: isOver ? 0.5 : 1,
            }}
        >
            <div className="bin_dropdown">
                {data !== undefined 
                    ? data.map((val, key) => (
                          <Sku
                              key={key}
                              id={val}
                              parent={binId}
                              setSku={setSku}
                              expiretime = {expiretime}
                          ></Sku>
                      ))
                    : null}
            </div>
            <div className="bin_identifier">
                <div className="circle">
                    <p>{binId}</p>
                </div>
                <img
                    alt="barcode"
                    src={barcode}
                    onClick={() => updateSelected(binId)}
                ></img>
            </div>
        </div>
    );
}

export default Bins;
