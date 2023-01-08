import { useState } from 'react';
// Material Components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Components
import WarehouseHeader from '../../components/ui/WarehouseHeader';
import WarehouseCard from '../../components/ui/WarehouseCard';
import WarehouseAlert from '../ui/WarehouseAlert';
import Chart from '../../components/chart/Chart';

export default function PerformanceMetricComp({
  previousRounds,
  performanceMetricData,
  round,
  setRound,
}) {
  return (
    <div className="home">
      <WarehouseHeader title="Team Score">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-filled-label">Round</InputLabel>
          <Select
            value={round}
            label="Round"
            onChange={(e) => setRound(e.target.value)}
          >
            {previousRounds.map((elm) => (
              <MenuItem key={elm} value={elm}>
                {elm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </WarehouseHeader>
      <WarehouseCard>
        {!performanceMetricData.length ? (
          <WarehouseAlert
            text={`No Performance Metric data to show for round: ${round}`}
          />
        ) : (
          <Chart
            series={[
              {
                data: performanceMetricData.map((elm) => elm.score),
              },
            ]}
            xAxis={performanceMetricData.map((elm) => elm.team)}
            type="bar"
            chartType="bar"
            horizontal
          />
        )}
      </WarehouseCard>
    </div>
  );
}
