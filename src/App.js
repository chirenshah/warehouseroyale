import './App.css';
import Bins from './components/bins'
import barcode from './assets/barcode.svg'
function App() {
  const bins = Array.from({length: 16}, (_, index) => {
    var label = ""
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
      </section>
      <section className='center'>
        <div className='bins'>
          {bins}
        </div>
        <div className='carts'></div>
      </section>
      <section className='record'></section>
    </div>
  );
}

export default App;
