import Chart from "../../components/chart/Chart";
import "./home.css";
import * as React from 'react';
import { userData } from "../../dummyData";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';

export default function Home() {
  const [pmetric, setPmetric] = React.useState('');

  const handleChange = (event) => {
    setPmetric(event.target.value);
  };

  return (
    <div className="home">

      <div className="metricselection">
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label">Metric</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={pmetric}
              onChange={handleChange}
            >
              <MenuItem value={1}>Point</MenuItem>
              <MenuItem value={2}>IRI</MenuItem>
              <MenuItem value={3}>No.Of Employees</MenuItem>
              <MenuItem value={4}>Individual turnover</MenuItem>
              <MenuItem value={5}>No.of Messages</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label">Round</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={pmetric}
              onChange={handleChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </FormControl>
          
      </div>
      <div className="App">
        <Chart/>
      </div>

    </div>
  );
}
