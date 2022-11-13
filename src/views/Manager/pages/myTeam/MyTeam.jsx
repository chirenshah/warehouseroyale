import { useEffect, useState } from 'react';
// Hooks
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useDocument } from '../../../../hooks/useDocument';
// Material Components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import Chart from '../../../../components/chart/Chart';
// Constants
import { COLLECTION_TEAMS } from '../../../../utils/constants';
// Helpers
import { getNewlyAddedEmployees, getTeamMembers } from './helpers';
import { getNewlyAddedEmployeesDetails } from './helpers';
// Css
import './MyTeam.css';
import myTeamChartData from '../../../../mockData/my-team-pie-chart-data.json';
import myTeamStackedChartData from '../../../../mockData/my-team-stacked-chart-data.json';

const roundItems = [1, 2, 3, 4];

export default function MyTeam() {
  const { user } = useAuthContext();

  const [newlyAddedEmployees, setNewlyAddedEmployees] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState(null);
  const [isProceededToShare, setIsProceededToShare] = useState(false);
  const [round, setRound] = useState(1);

  const {
    document: team,
    isPending: isTeamPending,
    error: teamError,
  } = useDocument(COLLECTION_TEAMS, user?.teamId);

  useEffect(() => {
    setLoading(true);

    (async () => {
      if (!team?.employees?.length) {
        return;
      }
      const teamMembers = await getTeamMembers(team.id);

      setTeamMembers(teamMembers);

      const newlyAddedEmployeesUids = getNewlyAddedEmployees(team?.employees);

      const newlyAddedEmployees = getNewlyAddedEmployeesDetails(
        newlyAddedEmployeesUids,
        teamMembers
      );

      setNewlyAddedEmployees(newlyAddedEmployees);
      setLoading(false);
    })();
  }, [team]);

  return (
    <div className="myTeam">
      <WarehouseHeader title={`Team ${user?.teamId || ''}`} />
      {loading && <WarehouseLoader />}
      {!isProceededToShare && newlyAddedEmployees && (
        <WarehouseCard>
          <List>
            {newlyAddedEmployees.map((employee) => (
              <div key={employee.uid}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={employee.fullName}
                    secondary="has been added to your organization."
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
          <WarehouseButton
            onClick={() => {
              setIsProceededToShare(true);
            }}
            text="Proceed to share"
          />
        </WarehouseCard>
      )}

      {isProceededToShare && (
        <>
          <WarehouseHeader title="Share structure of the team" />
          <WarehouseCard>
            <List>
              {teamMembers.map((member) => (
                <div key={member.uid}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        member.role === 'manager' ? 'You' : member.fullName
                      }
                      secondary="has been added to your organization."
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
            <WarehouseButton
              onClick={() => {
                // setIsProceededToShare(true);
              }}
              text="Update"
            />
          </WarehouseCard>
        </>
      )}

      <WarehouseCard>
        <Chart
          series={myTeamChartData.map((elm) => elm.score)}
          xAxis={myTeamChartData.map((elm) => elm.member)}
          type="pie"
          chartType="pie"
        />
      </WarehouseCard>
      <WarehouseHeader title="Team Performance Comparisson Metric" my>
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
      <WarehouseCard></WarehouseCard>
      <WarehouseHeader title="Accuracy Metric" my />
      <WarehouseCard>
        <Chart
          series={myTeamStackedChartData.map((elm) => {
            return {
              name: '',
              data: [...myTeamChartData.map((elm) => elm.score)],
            };
          })}
          xAxis={myTeamStackedChartData.map((elm) => elm.member)}
          type="stacked"
          chartType="bar"
        />
      </WarehouseCard>
    </div>
  );
}
