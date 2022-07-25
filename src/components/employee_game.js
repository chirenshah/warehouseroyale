import Bins from './bins'
import barcode from '../assets/barcode.svg'
import '../style/employee_game.css'
import Sku from './sku'

import { useState } from 'react'

export default function Game(){
    var label = ""
    
    // Low medium and high complexity for data
    // low is the numbering is ordered
    // medium is when you need to check more digits
    // hard is last 3 or 4 digits are same and middle would be different
    const data = Array.from({length: 20}, () =>  String.fromCharCode(65+Math.floor(Math.random() * 26))  +"123" + Math.floor(Math.random() * 100000).toString());
    const [sku_list,setSkuList] = useState(data)
    const [dellabel,setdelabel] = useState("")
    const [delid,setdelid] = useState("")
    const delsku = (parent,id) => {
        setdelabel(parent)
        setdelid(id)
        setSkuList(prev => prev.filter((val) => val !== id))
    }
    const bins = Array.from({length: 16}, (_, index) => {
        if(index < 4){
          label = "A" + (index+1).toString()
        }
        else if(index < 8){
          label = "B" + (index - 3).toString()
        }
        else if(index < 12){
          label = "C" + (index - 7).toString()
        }
        else{
          label = "D" + (index - 11).toString()
        }
        return <Bins key={index} binId={label} delsku={delsku} delbinId={dellabel} delid={delid}></Bins>;
      });
      return (
        <div>
            <section className='inventory'>
                <div className='barcode'>
                    <img alt="barcode" src={barcode}></img>
                    <h3>RECEIVING</h3>
                </div>
                <div className='sku_container'>
                    {sku_list.map((value,key) => (
                        <Sku key={key} id={value} parent={""}/>
                    ))}
                    </div>
            </section>
            <section className='center'>
                <div className='bins'>
                    {bins}
                </div>
                <div className='carts'>
                    <div className='order_bins'>
                        <Bins binId={"O1"} delsku={delsku} delbinId={dellabel} delid={delid}></Bins>
                        <div>Order 1</div>
                        <Bins binId={"O2"} delsku={delsku} delbinId={dellabel} delid={delid}></Bins>
                        <div>Order 2</div>
                    </div>
                    <div>
                        <div draggable onDragStart={()=>console.log("dragging")}>Send Order 1</div>
                        <div>Sednd Order 2</div>
                    </div>
                </div>
            </section>
            <section className='record'>
                <div className='scan_container'>
                        <h3>RECORD</h3>
                        <hr></hr>
                        <form>
                            <label>FROME LOCATION - <input type="text" name="from" /></label>
                            <label>TO LOCATION - <input type="text" name="to" /></label>
                            <label>SKU - <input type="text" name="sku" /></label>
                            <br></br>
                            <input type="submit" value="Submit" />
                        </form>
                </div>
                <div className='record_call_to_action'>
                    <img alt="barcode" src={barcode}></img>
                </div>
            </section>
        </div>
    )  
}
