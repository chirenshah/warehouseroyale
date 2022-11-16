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
import { getTeamMembers, updateShares } from './helpers';
// Css
import './MyTeam.css';
import myTeamChartData from '../../../../mockData/my-team-pie-chart-data.json';
import myTeamStackedChartData from '../../../../mockData/my-team-stacked-chart-data.json';

const roundItems = [1, 2, 3, 4];

export default function MyTeam() {
  const { user } = useAuthContext();

  const [newlyAddedEmployees, setNewlyAddedEmployees] = useState(null);
  const [teamMembers, setTeamMembers] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isProceededToShare, setIsProceededToShare] = useState(false);

  const [managerShare, setManagerShare] = useState(null);
  const [newEmployeesShare, setNewEmployeesShare] = useState({});

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

      // Get member details from users collection
      const teamMembers = await getTeamMembers(team.id);
      setTeamMembers(teamMembers);

      setManagerShare({
        [team.manager.uid]: teamMembers.find(
          (member) => member.role === 'manager'
        ).share,
      });

      const newlyAddedEmployees = teamMembers?.filter(
        (member) => member.share === 0
      );
      setNewlyAddedEmployees(newlyAddedEmployees);

      let employeeShares = {};
      for (const employee of newlyAddedEmployees) {
        employeeShares[`${employee.uid}`] = employee.share;
      }
      setNewEmployeesShare(employeeShares);

      setLoading(false);
    })();
  }, [team]);

  useEffect(() => {
    if (!Object.values(newEmployeesShare).length) {
      return;
    }
    const totalSharesOfNewEmployees = Object.values(newEmployeesShare).reduce(
      (prev, curr) => {
        return Number(curr) + Number(prev);
      }
    );

    setManagerShare({ [team.manager.uid]: 100 - totalSharesOfNewEmployees });
  }, [newEmployeesShare]);

  const handleOnchangeShare = (e) => {
    setNewEmployeesShare((prev) => {
      return { ...prev, [e.target.name]: Number(e.target.value) };
    });
  };

  const handleShareUpdate = async () => {
    // TODO: Put validations
    updateShares({ ...managerShare, ...newEmployeesShare });
  };

  return (
    <div className="myTeam">
      <WarehouseHeader title={`Team ${user?.teamId || ''}`} />
      {loading && <WarehouseLoader />}
      {!isProceededToShare && newlyAddedEmployees?.length ? (
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
      ) : null}

      {isProceededToShare && (
        <>
          <WarehouseHeader title="Share structure of the team" />
          <WarehouseCard>
            <List>
              <ListItem alignItems="center">
                <TextField
                  value={Object.values(managerShare)[0]}
                  type="number"
                  sx={{ marginRight: '1rem', width: '5rem' }}
                  size="small"
                  disabled
                />
                <ListItemText primary="You" />
              </ListItem>
              {newlyAddedEmployees.map((member) => (
                <ListItem key={member.uid} alignItems="center">
                  <TextField
                    onChange={handleOnchangeShare}
                    value={newEmployeesShare[`${member.uid}`]}
                    type="number"
                    name={member.uid}
                    sx={{ marginRight: '1rem', width: '5rem' }}
                    size="small"
                  />
                  <ListItemText primary={member.fullName} />
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

      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Box sx={{ flex: 2 }}>
          <WarehouseCard>
            {loading ? (
              <WarehouseLoader />
            ) : (
              <Chart
                series={teamMembers?.map((member) => member.share)}
                xAxis={teamMembers?.map((member) => member.fullName)}
                type="pie"
                chartType="pie"
              />
            )}
          </WarehouseCard>
        </Box>
        <Box sx={{ flex: 1.5, height: '100%' }}>
          <WarehouseCard>
            {loading ? (
              <WarehouseLoader />
            ) : (
              <>
                <List>
                  {teamMembers?.map((member) => (
                    <ListItem key={member.uid} alignItems="center">
                      <TextField
                        onChange={handleOnchangeShare}
                        value={member.share}
                        type="number"
                        name={member.uid}
                        sx={{ marginRight: '1rem', width: '5rem' }}
                        size="small"
                      />
                      <ListItemText primary={member.fullName} />
                    </ListItem>
                  ))}
                </List>
                <WarehouseButton
                  onClick={() => handleShareUpdate()}
                  text="Update"
                />
              </>
            )}
          </WarehouseCard>
        </Box>
      </Box>

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
