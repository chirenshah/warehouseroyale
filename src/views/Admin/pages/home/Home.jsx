// Hooks
import { useCollection } from '../../../../hooks/useCollection';
import useFetchClassesAndTeams from '../../../../hooks/useFetchClassesAndTeams';
// Material Components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseAlert from '../../../../components/ui/WarehouseAlert';
import Chart from '../../../../components/chart/Chart';
// Helpers
import { getXAxisCategories } from './helpers';
import { getTeamsChartData } from './helpers/getTeamsChartData';
import { getTeamList } from './helpers/getTeamList';
// Constants
import { COLLECTION_CLASSES } from '../../../../utils/constants';
// Css
import './Home.css';

export default function Home() {
  const {
    documents: classes,
    isPending: classesPending,
    error: classesError,
  } = useCollection(COLLECTION_CLASSES);

  const {
    selectedClass,
    setSelectedClass,
    selectedTeam,
    setSelectedTeam,
    classCollection,
    teamMembers,
  } = useFetchClassesAndTeams();

  return (
    <div className="home">
      <WarehouseHeader title="Team Score">
        {classesPending ? (
          <WarehouseLoader />
        ) : classesError ? (
          <WarehouseAlert text={classesError} severity="error" />
        ) : !classes.length ? (
          <WarehouseAlert text="No classes found" />
        ) : (
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              label="Class"
              onChange={(e) => {
                setSelectedClass(e.target.value);
              }}
            >
              {classes.map(({ id }) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </WarehouseHeader>

      <WarehouseCard>
        {!selectedClass ? (
          <WarehouseAlert text="Select a class" />
        ) : classCollection.isPending ? (
          <WarehouseLoader />
        ) : classCollection.error ? (
          <WarehouseAlert text={classCollection.error} />
        ) : !classCollection.document?.length ? (
          <WarehouseAlert text="No points to show" />
        ) : (
          <Chart
            series={getTeamsChartData(classCollection?.document, 'Points').map(
              (elm) => {
                return {
                  name: elm.round,
                  data: elm.scores,
                };
              }
            )}
            xAxis={getXAxisCategories(
              'Team',
              getTeamsChartData(classCollection?.document, 'Points')[0]?.scores
            )}
            type="column"
            chartType="bar"
          />
        )}
      </WarehouseCard>

      <WarehouseHeader my title="IRI Score" />
      <WarehouseCard>
        {!selectedClass ? (
          <WarehouseAlert text="Select a team" />
        ) : classCollection.isPending ? (
          <WarehouseLoader />
        ) : classCollection.error ? (
          <WarehouseAlert text={classCollection.error} />
        ) : !classCollection.document?.length ? (
          <WarehouseAlert text="No members in a team" />
        ) : (
          <Chart
            series={getTeamsChartData(classCollection?.document, 'IRI').map(
              (elm) => {
                return {
                  name: elm.round,
                  data: elm.scores,
                };
              }
            )}
            xAxis={getXAxisCategories(
              'Team',
              getTeamsChartData(classCollection?.document, 'IRI')[0]?.scores
            )}
            type="column"
            chartType="bar"
          />
        )}
      </WarehouseCard>

      <WarehouseHeader my title="Team Structure">
        {classesPending ? (
          <WarehouseLoader />
        ) : classesError ? (
          <WarehouseAlert text={classesError} severity="error" />
        ) : !classes.length ? (
          <WarehouseAlert text="No team found" />
        ) : (
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Team</InputLabel>
            <Select
              value={selectedTeam}
              label="Team"
              onChange={(e) => {
                setSelectedTeam(e.target.value);
              }}
            >
              {getTeamList(classCollection.document).map((team) => (
                <MenuItem key={team} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </WarehouseHeader>

      <WarehouseCard>
        {!selectedTeam ? (
          <WarehouseAlert text="Select a team" />
        ) : teamMembers.isPending ? (
          <WarehouseLoader />
        ) : teamMembers.error ? (
          <WarehouseAlert text={teamMembers.error} />
        ) : !teamMembers.document?.length ? (
          <WarehouseAlert text="No team structure to show" />
        ) : (
          <Chart
            series={teamMembers?.document?.map((member) =>
              Number(member.share)
            )}
            xAxis={teamMembers?.document?.map((member) => member.fullName)}
            type="donut"
            chartType="donut"
          />
        )}
      </WarehouseCard>
    </div>
  );
}
