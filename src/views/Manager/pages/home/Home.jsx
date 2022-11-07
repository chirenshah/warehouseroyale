import { useState } from 'react';
// Material Components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import Chart from '../../../../components/chart/Chart';
// Css
import './Home.css';
import performanceMetricData from '../../../../mockData/performance-metric-chart-data.json';

const roundItems = [1, 2, 3, 4];

export default function Home() {
  const [round, setRound] = useState(1);

  return (
    <div className="home">
      <WarehouseHeader title="Team Score">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-filled-label">Round</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={round}
            label="Round"
            onChange={(e) => setRound(e.target.value)}
          >
            {roundItems.map((elm) => (
              <MenuItem key={elm} value={elm}>
                {elm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </WarehouseHeader>
      <WarehouseCard>
        <Chart
          series={[
            {
              data: performanceMetricData.map((elm) => elm.score),
            },
          ]}
          xAxis={performanceMetricData.map((elm) => elm.name)}
          type="bar"
          chartType="bar"
          horizontal
        />
      </WarehouseCard>
    </div>
  );
}
