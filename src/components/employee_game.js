import Bins from './bins'
import barcode from '../assets/barcode.svg'
import '../style/employee_game.css'

export default function Game(){
    var label = ""
    const Sku = ({id}) => {
        return (
            <div className='sku'><p>{id}</p></div>
        )
    }
    const data = Array.from({length: 20}, () =>  String.fromCharCode(65+Math.floor(Math.random() * 26))  + Math.floor(Math.random() * 100000000).toString());
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
        return <Bins key={index} label={label}/>;
      });
      
      return (
        <div>
            <section className='inventory'>
                <div className='barcode'>
                    <img alt="barcode" src={barcode}></img>
                    <h3>RECEIVING</h3>
                </div>
                <div className='sku_container'>
                    {data.map((value,key) => (
                        <Sku key={key} id={value}/>
                    ))}
                    </div>
            </section>
            <section className='center'>
                <div className='bins'>
                    {bins}
                </div>
                <div className='carts'>
                    <div className='order_bins'>
                        <Bins label={"O1"}></Bins>
                        <div>Order 1</div>
                        <Bins label={"O2"}></Bins>
                        <div>Order 2</div>
                    </div>
                    <div>
                        <div>Send Order 1</div>
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
