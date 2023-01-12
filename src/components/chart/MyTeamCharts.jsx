// Components
import WarehouseCard from '../ui/WarehouseCard';
import WarehouseHeader from '../ui/WarehouseHeader';
import Chart from './Chart';
// Helpers
import { getXAxisCategories } from '../../views/Admin/pages/home/helpers';

export default function MyTeamCharts({ pointsChartData, iriChartData }) {
  return (
    <div>
      <WarehouseHeader my title="Team Score" />
      <WarehouseCard>
        <Chart
          series={pointsChartData.map((elm) => {
            return {
              name: elm.round,
              data: elm.scores,
            };
          })}
          xAxis={getXAxisCategories('Round', pointsChartData[0]?.scores)}
          type="column"
          chartType="bar"
        />
      </WarehouseCard>

      <WarehouseHeader my title="IRI Score" />
      <WarehouseCard>
        <Chart
          series={iriChartData.map((elm) => {
            return {
              name: elm.round,
              data: elm.scores,
            };
          })}
          xAxis={getXAxisCategories('Round', iriChartData[0]?.scores)}
          type="column"
          chartType="bar"
        />
      </WarehouseCard>
    </div>
  );
}
