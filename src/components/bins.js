import { useDrop } from "react-dnd";
import Sku from "./sku";
import "../style/bin.css";
import React from "react";
import barcode from "../assets/barcode.svg";
import { binUpdate } from "../Database/firestore";
function Bins({ binId, updateSelected, setSku, data, set_data, setSkuList }) {
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: "sku",
            drop: (item) => {
                if (binId !== item["parent"])
                    binUpdate(
                        item["parent"],
                        binId,
                        item["id"],
                        set_data,
                        item["expiretime"]
                    );
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
                {data
                    ? data.map((val, key) => (
                          <Sku
                              key={key}
                              id={Object.keys(val)[0]}
                              parent={binId}
                              setSku={setSku}
                              expiretime={val[Object.keys(val)[0]]}
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
