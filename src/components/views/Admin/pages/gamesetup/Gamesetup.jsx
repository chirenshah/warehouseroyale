import "./Gamesetup.css";
import { FormLabel, FormControl, Radio, RadioGroup} from '@mui/material';
import TextField from '@mui/material/TextField';
import { FormControlLabel } from '@mui/material';

export default function Gamesetup() {

  const handleSubmit = event => {
    event.preventDefault();

    console.log('form submitted ✅');
  };

  return (
  <div className="features">
      <form onSubmit={handleSubmit}>
        <div className="inputValues">
          <TextField mediumWidth label=" Number Of Rounds" defaultValue={3} size='medium'/>
          <TextField mediumWidth label=" Max. Member in a team " defaultValue={5} size='medium' />
          <TextField mediumWidth label=" Total No. of teams " defaultValue={5} size='medium' />
          <TextField mediumWidth label=" Number Of SKU" defaultValue={12} size='medium' />
        </div>
        <div className="yesno">
            <FormControl>
              <FormLabel
                style={{color:"#393145", fontSize: '1.25rem'}}
                id="demo-radio-buttons-group-label">
                  Can Employees Communicate with each other ?
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="yes"
                name="radio-buttons-group"
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
        </div>
        <div className="yesno">
            <FormControl>
              <FormLabel style={{color:"#393145", fontSize: '1.25rem'}} id="demo-radio-buttons-group-label" > Do individual is allowed to see other team's score ?</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="yes"
                name="radio-buttons-group"
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
        </div>
        <div className="yesno">
            <FormControl>
              <FormLabel style={{color:"#393145", fontSize: '1.25rem'}} id="demo-radio-buttons-group-label" > Can the Employee see if the order was success ?</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="yes"
                name="radio-buttons-group"
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
        </div>
        <div className="yesno">
            <FormControl>
              <FormLabel style={{color:"#393145", fontSize: '1.25rem'}} id="demo-radio-buttons-group-label" > Can employees message other teams manager ?</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="yes"
                name="radio-buttons-group"
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
        </div>
        <button className="submitbutton" >Submit</button>
    </form>
  </div>

  );
}
