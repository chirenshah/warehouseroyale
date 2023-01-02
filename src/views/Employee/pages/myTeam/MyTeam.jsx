// Hooks
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useCollection } from '../../../../hooks/useCollection';
// Components
import Chart from '../../../../components/chart/Chart';
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseAlert from '../../../../components/ui/WarehouseAlert';
// Constants
import { COLLECTION_USERS } from '../../../../utils/constants';
// Css
import './MyTeam.css';

export default function MyTeam() {
  const { user: currentUser } = useAuthContext();
  const {
    documents: teamMembers,
    isPending: areTeamMembersPending,
    error: teamMembersError,
  } = useCollection(COLLECTION_USERS, [
    { fieldPath: 'teamId', queryOperator: '==', value: currentUser.teamId },
  ]);

  return (
    <div className="myTeam">
      {teamMembersError && (
        <WarehouseAlert text={teamMembersError} severity="error" />
      )}
      <WarehouseHeader title="Compensation structure" />
      <WarehouseCard>
        {areTeamMembersPending || !teamMembers ? (
          <WarehouseLoader />
        ) : (
          <Chart
            series={teamMembers?.map((member) => Number(member.share))}
            xAxis={teamMembers?.map((member) => member.fullName)}
            type="pie"
            chartType="pie"
          />
        )}
      </WarehouseCard>
    </div>
  );
}
