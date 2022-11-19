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

  const [employees, setEmployees] = useState(null);
  const [newlyAddedEmployees, setNewlyAddedEmployees] = useState(null);

  const [teamMembers, setTeamMembers] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isProceededToShare, setIsProceededToShare] = useState(false);

  const [managerShare, setManagerShare] = useState({});
  const [updatedManagerShare, setUpdatedManagerShare] = useState({});

  const [employeesShare, setEmployeesShare] = useState({});
  const [newEmployeesShare, setNewEmployeesShare] = useState({});

  const [round, setRound] = useState(1);

  const {
    document: team,
    isPending: isTeamPending,
    error: teamError,
  } = useDocument(COLLECTION_TEAMS, user?.teamId);

  // TODO: Refactor repetitions!!!

  useEffect(() => {
    if (!team) {
      return;
    }

    (async () => {
      setLoading(true);

      // Get member details from users collection
      const teamMembers = await getTeamMembers(team.id);
      setTeamMembers(teamMembers);

      setManagerShare(
        (prev) =>
          (prev = {
            [team.manager.uid]: teamMembers.find(
              (member) => member.role === 'manager'
            ).share,
          })
      );
      setUpdatedManagerShare(
        (prev) =>
          (prev = {
            [team.manager.uid]: teamMembers.find(
              (member) => member.role === 'manager'
            ).share,
          })
      );

      // Existing Employee----------------------------------------------------------------
      const employees = teamMembers?.filter(
        (member) => member.role !== 'manager' && member.share !== 0
      );

      setEmployees(employees);

      let employeesShare = {};
      for (const employee of employees) {
        employeesShare[`${employee.uid}`] = employee.share;
      }
      setEmployeesShare(employeesShare);
      // Existing Employee----------------------------------------------------------------

      // New Employee----------------------------------------------------------------
      const newlyAddedEmployees = teamMembers?.filter(
        (member) => member.share === 0
      );
      setNewlyAddedEmployees(newlyAddedEmployees);

      let newlyAddedEmployeesShare = {};
      for (const employee of newlyAddedEmployees) {
        newlyAddedEmployeesShare[`${employee.uid}`] = employee.share;
      }
      setNewEmployeesShare(newlyAddedEmployeesShare);
      // New Employee----------------------------------------------------------------

      setLoading(false);
    })();
  }, [team]);

  // New Employee----------------------------------------------------------------
  useEffect(() => {
    if (!Object.values(newEmployeesShare).length) {
      return;
    }

    const totalSharesOfNewEmployees = Object.values(newEmployeesShare).reduce(
      (prev, curr) => {
        return Number(curr) + Number(prev);
      }
    );

    setUpdatedManagerShare({
      [team.manager.uid]: 100 - totalSharesOfNewEmployees,
    });
  }, [newEmployeesShare]);

  const handleOnChangeNewEmployeeShare = (e) => {
    setNewEmployeesShare((prev) => {
      return { ...prev, [e.target.name]: Number(e.target.value) };
    });
  };
  // New Employee----------------------------------------------------------------

  // Existing Employee----------------------------------------------------------------
  useEffect(() => {
    if (!Object.values(employeesShare).length) {
      return;
    }

    const totalSharesOfEmployees = Object.values(employeesShare).reduce(
      (prev, curr) => {
        return Number(curr) + Number(prev);
      }
    );

    setUpdatedManagerShare({
      [team.manager.uid]: 100 - totalSharesOfEmployees,
    });
  }, [employeesShare]);

  const handleOnChangeEmployeeShare = (e) => {
    setEmployeesShare((prev) => {
      return { ...prev, [e.target.name]: Number(e.target.value) };
    });
  };
  // Existing Employee----------------------------------------------------------------

  const handleShareUpdate = async (employee) => {
    // TODO: Put validations

    if (employee === 'new') {
      updateShares({ ...updatedManagerShare, ...newEmployeesShare });
    } else {
      updateShares({ ...updatedManagerShare, ...employeesShare });
    }
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
            Your updated share will be: {Object.values(updatedManagerShare)[0]}%
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
                    onChange={handleOnChangeNewEmployeeShare}
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
              onClick={() => handleShareUpdate('new')}
              text="Update"
            />
          </WarehouseCard>
        </>
      )}

      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Box sx={{ flex: 2 }}>
          <WarehouseCard>
            {loading || !teamMembers ? (
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
            {loading || !teamMembers ? (
              <WarehouseLoader />
            ) : (
              <>
                Your updated share will be:{' '}
                {Object.values(updatedManagerShare)[0]}%
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
                  {employees?.map((member) => (
                    <ListItem key={member.uid} alignItems="center">
                      <TextField
                        onChange={handleOnChangeEmployeeShare}
                        value={employeesShare[`${member.uid}`]}
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
                  onClick={() => handleShareUpdate('old')}
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
