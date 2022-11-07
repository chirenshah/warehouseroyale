import { useEffect, useState } from 'react';
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
import pointData from '../../../../mockData/point-chart-data.json';
import { getXAxisCategories } from './helpers';

export const metricItems = [
  'Point',
  'IRI',
  'No. of Employees',
  'Individual Turnover',
];
export const roundItems = [1, 2, 3, 4];

export default function Home() {
  const [pMetric, setPMetric] = useState('Point');
  const [round, setRound] = useState(1);
  const [chartData, setChartData] = useState(pointData);

  useEffect(() => {
    switch (pMetric) {
      case 'Point':
        setChartData(pointData);
        break;
      case 'IRI':
        setChartData([]);
        break;
      case 'No. of Employees':
        setChartData([]);
        break;
      case 'Individual Turnover':
        setChartData([]);
        break;

      default:
        setChartData([]);
    }
  }, [pMetric]);

  return (
    <div className="home">
      <WarehouseHeader title="Team Score">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-filled-label">Metric</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={pMetric}
            label="Metric"
            onChange={(e) => setPMetric(e.target.value)}
          >
            {metricItems.map((elm) => (
              <MenuItem key={elm} value={elm}>
                {elm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          series={chartData.map((elm) => {
            return {
              name: elm.name,
              data: elm.scores,
            };
          })}
          xAxis={getXAxisCategories('Team', chartData[0].scores)}
          type="column"
          chartType="bar"
        />
      </WarehouseCard>
    </div>
  );
}
