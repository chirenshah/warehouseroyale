import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
export default function Sku({ id, parent, setSku , expiretime }) {
    const [timer,settimer]  = useState(expiretime)
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: "sku",
            item: { id, parent,timer},
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [id,timer]
    );
    //settimer(() => timeObject.getSeconds().toString());
    useEffect(() => {
        if(parent !== ""){
            const timeout = setTimeout(() => {
                const timeObject = new Date("1970-01-01 00:" + timer);
                if(timer !== "00:00" && timer !== "Expired"){
                    timeObject.setSeconds(timeObject.getSeconds()-1);
                    var minute = timeObject.getMinutes();
                    var seconds = timeObject.getSeconds();
                    if (minute < 10)  minute = '0'+ minute;
                    if (seconds < 10)  seconds = '0'+ seconds;
                    settimer(minute +":"+seconds);
                }
                else{
                    settimer(() => "Expired");
                }
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [timer,parent])
    return (
        <div
            className="sku"
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                color : timer === "Expired" ? "red":"black",
                justifyContent: parent === ""? "center":"space-around" 
            }}
            onClick={() => setSku(id)}
        >
            <p>{id}</p>
            <div>{parent !== ""?(<p>{timer}</p>):null}</div>
        </div>
    );
}
