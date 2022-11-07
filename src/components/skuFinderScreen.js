import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { returnSku, skuFinder } from "../Database/firestore";

export function SkuFinderScreen({ SetshowScreen }) {
    const [skuList, setskuList] = useState([]);
    const [autoValue, setautoValue] = useState("");
    const [ans, setAns] = useState();
    useEffect(() => {
        returnSku(setskuList);
    }, []);
    return (
        <div className="skuFinderScreen">
            <div className="skuFinder">
                <div>
                    <button
                        onClick={() => {
                            SetshowScreen(false);
                        }}
                    >
                        x
                    </button>
                    <Autocomplete
                        onChange={(event, value) => {
                            setAns("");
                            setautoValue(value);
                        }}
                        options={skuList}
                        sx={{ margin: 1 }}
                        renderInput={(params) => (
                            <TextField {...params} label="SkuID" />
                        )}
                    ></Autocomplete>
                </div>
                <br />
                <button
                    className="findSkuButton"
                    onClick={() => {
                        skuFinder(autoValue).then((val) => {
                            setAns(val);
                        });
                    }}
                >
                    Find the Sku
                </button>
                {ans ? <div>{autoValue + " is at " + ans}</div> : null}
            </div>
        </div>
    );
}
