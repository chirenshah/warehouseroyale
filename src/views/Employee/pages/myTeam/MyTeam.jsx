// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import Chart from '../../../../components/chart/Chart';
// Css
import './MyTeam.css';

export default function MyTeam() {
  return (
    <div className="myTeam">
      <WarehouseHeader title="Compensation structure" />
      <WarehouseCard>
        <Chart
          series={[25, 75]}
          xAxis={['My Share', "Manager X's share + Co-workers' share"]}
          type="pie"
          chartType="pie"
        />
      </WarehouseCard>
    </div>
  );
}
