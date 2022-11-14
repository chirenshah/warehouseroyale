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
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import Chart from '../../../../components/chart/Chart';
// Constants
import { COLLECTION_TEAMS } from '../../../../utils/constants';
// Helpers
import {
  getMemberShare,
  getNewlyAddedEmployeesUids,
  getTeamMembers,
  getNewlyAddedEmployeesDetails,
} from './helpers';
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

      const newlyAddedEmployeesUids = getNewlyAddedEmployeesUids(
        team?.employees
      );

      const newlyAddedEmployees = getNewlyAddedEmployeesDetails(
        newlyAddedEmployeesUids,
        teamMembers
      );

      setNewlyAddedEmployees(newlyAddedEmployees);
      setLoading(false);
    })();
  }, [team]);

  const handleShareUpdate = async () => {};

  return (
    <div className="myTeam">
      <WarehouseHeader title={`Team ${user?.teamId || ''}`} />
      {loading && <WarehouseLoader />}
      {!isProceededToShare && newlyAddedEmployees && (
        <WarehouseCard>
          <List sx={{ width: '100%' }}>
            {newlyAddedEmployees.map((employee) => (
              <ListItem key={employee.uid}>
                <ListItemText
                  primary={employee.fullName}
                  secondary="has been added to your organization."
                />
              </ListItem>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              Remaining percentage % : {10}
            </Box>
            <List>
              {newlyAddedEmployees.map((member) => (
                <ListItem key={member.uid} alignItems="center">
                  <TextField
                    value={getMemberShare(member.uid, team.employees)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-100]*' }}
                    sx={{ marginRight: '1rem', width: '5rem' }}
                    size="small"
                  />
                  <ListItemText
                    primary={
                      member.role === 'manager' ? 'You' : member.fullName
                    }
                  />
                </ListItem>
              ))}
            </List>
            <WarehouseButton
              onClick={() => handleShareUpdate()}
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
