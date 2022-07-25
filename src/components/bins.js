import { useState } from "react";
import { useDrop } from "react-dnd";
import Sku from './sku'
import "../style/bin.css"
import barcode from '../assets/barcode.svg'
function Bins({binId,delsku,delbinId,delid}){
    const [disp,setdisp] = useState([])
    const [parent,setparent] = useState("")
    
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'sku',
        drop: (item) => {
            setparent(item['parent'])
            delsku(item['parent'],item['id'])
            if(binId !== item['parent'])setdisp((prev)=> [item['id'],...prev])
        },
        collect: monitor => ({
          isOver: !!monitor.isOver(),
        }),
      }), [binId])
    // console.log(binId)
    // console.log(delbinId)
    if(binId === delbinId && binId !== parent){
        if(disp.includes(delid)){
            setdisp((prev) => prev.filter((val)=> val !== delid))
        }  
    }    
    return(
        <div className="bin_body" ref={drop} 
        style={{
            opacity:isOver? 0.5:1
        }}>
            <div className="bin_dropdown">
                {disp !== [] ? disp.map((val,key)=>(<Sku key={key} id={val} parent={binId}></Sku>)):null}
            </div>
            <div className="bin_identifier">
                <div className="circle"><p>{binId}</p></div>
                <img alt="barcode" src={barcode}></img>
            </div>
        </div>
    )
}

export default Bins;