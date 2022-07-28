import Bins from './bins'
import barcode from '../assets/barcode.svg'
import '../style/employee_game.css'
import Sku from './sku'

import { useState,createRef } from 'react'

export default function Game(){
    var label = ""
    var from = createRef();
    var to = createRef();
    var sku = createRef();
    var selected;
    // Low medium and high complexity for data
    // low is the numbering is ordered
    // medium is when you need to check more digits
    // hard is last 3 or 4 digits are same and middle would be different
    const data = Array.from({length: 20}, () =>  String.fromCharCode(65+Math.floor(Math.random() * 26))  +"123" + Math.floor(Math.random() * 100000).toString());
    const [sku_list,setSkuList] = useState(data);
    const [dellabel,setdelabel] = useState("");
    const [delid,setdelid] = useState("");
    const [skuSelected,setskuSelected] = useState("");
    const delsku = (parent,id) => {
        setdelabel(parent)
        setdelid(id)
        setSkuList(prev => prev.filter((val) => val !== id))
    }
    const duplidata = sku_list.slice(0,12)
    const orders = Array.from({length:10}, (_,index)=> {
        return <div className='cards' key={index}>{duplidata[index]}: <b>{Math.floor(Math.random()*5)}</b></div>
    })
    function sendorder(label){
        setdelabel(label);
        setdelid("all");
    }
    function chooseSelected(reference){
        if(selected){
            selected.current.classList = "";
        }
        selected = reference
        selected.current.classList = "selected";
    }
    function updateSelected(label){
        if(selected){
            selected.current.childNodes[1].value = label;
            selected.current.classList = "";
        }
    }
    function setSku(id){
        setskuSelected(id);
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
        return <Bins key={index} binId={label} delsku={delsku} delbinId={dellabel} delid={delid} updateSelected={updateSelected} setSku={setskuSelected}></Bins>;
      });
      console.log(selected);
      return (
        <div>
            <section className='inventory'>
                <div className='barcode'>
                    <img alt="barcode" src={barcode} onClick={()=>updateSelected("Inventory")}></img>
                    <h3>RECEIVING</h3>
                </div>
                <div className='sku_container'>
                    {sku_list.map((value,key) => (
                        <Sku key={key} id={value} parent={""} setSku={setSku}/>
                    ))}
                    </div>
            </section>
            <section className='center'>
                <div className='bins'>
                    {bins}
                </div>
                <div className='carts'>
                    <div>
                        
                        <Bins binId={"O1"} delsku={delsku} delbinId={dellabel} delid={delid} selected={selected} updateSelected={updateSelected} setSku={setskuSelected}></Bins>
                        <button className='send-btn' onClick={() => sendorder("O1")}>Send Order 2</button>
                    </div>
                    
                    <div className='order'>
                        <p>Order 1 </p>
                        <div className='order-content'>{orders}</div>
                    </div>
                    <div>
                        <Bins binId={"O2"} delsku={delsku} delbinId={dellabel} delid={delid} selected={selected} updateSelected={updateSelected}></Bins>
                        <button className='send-btn' onClick={() => sendorder("O2")}>Send Order 2</button>
                    </div>
                    <div className='order'><p>Order 2</p>
                        <div className='cards'>
                            123144 : <b>5</b>
                        </div>
                        <div className='cards'>
                            123131 : <b>3</b>
                        </div>
                        <div className='cards'>
                            123131 : <b>4</b>
                        </div>
                    </div>  
                </div>
            </section>
            <section className='record'>
                <div className='scan_container'>
                        <h3>RECORD</h3>
                        <hr></hr>
                        <form>
                            <label  ref={from} onClick={()=>chooseSelected(from)}>FROM LOCATION - <input type="text" name="from" /></label><br></br>
                            <label ref={to} onClick={()=> chooseSelected(to)}>TO LOCATION - <input type="text" name="to" /></label><br></br>
                            <label ref={sku} onClick={()=> chooseSelected(sku)}>SKU - <input type="text" name="sku" /></label>
                            <br></br>
                            <input type="submit" value="Submit" className='submit-btn'/>
                        </form>
                </div>
                <div className='record_call_to_action'>
                    <img alt="barcode" src={barcode}  style={{
                        opacity: skuSelected? 1 : 0.1
                    }} onClick={()=> {
                        if(skuSelected){
                            sku.current.childNodes[1].value = skuSelected;
                            sku.current.classList = "";
                        }
                    }} ></img>
                    {skuSelected}
                    <button className='send-btn black'>TASK</button>
                    <button className='send-btn white'>SUBMIT</button>
                    <button className='submit-btn chat'>Chat</button>
                </div>
                
            </section>
        </div>
    )  
}
