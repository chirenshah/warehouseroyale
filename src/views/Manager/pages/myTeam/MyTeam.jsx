import { useEffect, useState } from 'react';
// Hooks
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useDocument } from '../../../../hooks/useDocument';
import { useCollection } from '../../../../hooks/useCollection';
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
import {
  COLLECTION_TEAMS,
  COLLECTION_USERS,
} from '../../../../utils/constants';
// Helpers
import { getTeamMembers, updateShares } from './helpers';
// Css
import './MyTeam.css';
import myTeamChartData from '../../../../mockData/my-team-pie-chart-data.json';
import myTeamStackedChartData from '../../../../mockData/my-team-stacked-chart-data.json';

const roundItems = [1, 2, 3, 4];

export default function MyTeam() {
  const { user } = useAuthContext();

  const [teamMembers, setTeamMembers] = useState(null);
  // Manager
  const [managerShare, setManagerShare] = useState({});
  const [updatedManagerShare, setUpdatedManagerShare] = useState({});
  // Existing employees
  const [employees, setEmployees] = useState(null);
  const [employeesShare, setEmployeesShare] = useState({});
  // New employees
  const [newlyAddedEmployees, setNewlyAddedEmployees] = useState(null);
  const [newEmployeesShare, setNewEmployeesShare] = useState({});

  const [loading, setLoading] = useState(false);
  const [isProceededToShare, setIsProceededToShare] = useState(false);

  const [round, setRound] = useState(1);

  const {
    document: team,
    isPending: isTeamPending,
    error: teamError,
  } = useDocument(COLLECTION_TEAMS, user?.teamId);

  // const {
  //   documents: teamMembers,
  //   isPending: areTeamMembersPending,
  //   error: teamMembersError,
  // } = useCollection(COLLECTION_USERS, ['teamId', '==', team?.id]);

  useEffect(() => {
    if (!team) {
      return;
    }

    (async () => {
      setLoading(true);

      // Get member details from users collection
      const teamMembers = await getTeamMembers(team.id);
      setTeamMembers(teamMembers);

      // Update manager's states
      const managerShare = {
        [team.manager.uid]: teamMembers.find(
          (member) => member.role === 'manager'
        ).share,
      };
      setManagerShare((prev) => (prev = managerShare));
      setUpdatedManagerShare((prev) => (prev = managerShare));

      // Update existing Employees' states
      const employees = teamMembers?.filter(
        (member) => member.role !== 'manager' && !member.isNew
      );
      setEmployees(employees);

      let employeesShare = {};
      for (const employee of employees) {
        employeesShare[`${employee.uid}`] = employee.share;
      }
      setEmployeesShare(employeesShare);

      // Update new employees' states
      const newlyAddedEmployees = teamMembers?.filter((member) => member.isNew);
      setNewlyAddedEmployees(newlyAddedEmployees);

      let newlyAddedEmployeesShare = {};
      for (const employee of newlyAddedEmployees) {
        newlyAddedEmployeesShare[`${employee.uid}`] = employee.share;
      }
      setNewEmployeesShare(newlyAddedEmployeesShare);

      setLoading(false);
    })();
  }, [team]);

  const calculateTotalSharesOfEmployees = (type) => {
    const employeeShares = type === 'new' ? newEmployeesShare : employeesShare;

    const totalSharesOfEmployees = Object.values(employeeShares).reduce(
      (prev, curr) => {
        return Number(curr) + Number(prev);
      }
    );

    return totalSharesOfEmployees;
  };

  // New employee onchange calculation
  useEffect(() => {
    if (!Object.values(newEmployeesShare).length) {
      return;
    }

    const totalSharesOfEmployees = calculateTotalSharesOfEmployees('new');

    setUpdatedManagerShare({
      [team.manager.uid]:
        managerShare[`${team.manager.uid}`] - totalSharesOfEmployees,
    });
  }, [newEmployeesShare]);

  // Existing employee onchange calculation
  useEffect(() => {
    if (!Object.values(employeesShare).length) {
      return;
    }

    const totalSharesOfEmployees = calculateTotalSharesOfEmployees('existing');

    setUpdatedManagerShare({
      [team.manager.uid]:
        managerShare[`${team.manager.uid}`] - totalSharesOfEmployees,
    });
  }, [employeesShare]);

  const handleOnChangeShare = (e, type) => {
    e.preventDefault();
    if (type === 'new') {
      setNewEmployeesShare((prev) => {
        return { ...prev, [e.target.name]: Number(e.target.value) };
      });
    } else {
      setEmployeesShare((prev) => {
        return { ...prev, [e.target.name]: Number(e.target.value) };
      });
    }
  };

  const handleShareUpdate = async (type) => {
    // TODO: Put validations

    if (type === 'new') {
      await updateShares({ ...updatedManagerShare, ...newEmployeesShare });
    } else {
      await updateShares({ ...updatedManagerShare, ...employeesShare });
    }

    window.location.reload(); // TODO: It's temporary solution!!
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
            <ShareList
              updatedManagerShare={updatedManagerShare}
              managerShare={managerShare}
              employees={newlyAddedEmployees}
              employeesShare={newEmployeesShare}
              handleOnChangeShare={(e) => handleOnChangeShare(e, 'new')}
              handleShareUpdate={() => handleShareUpdate('new')}
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
              <ShareList
                updatedManagerShare={updatedManagerShare}
                managerShare={managerShare}
                employees={employees}
                employeesShare={employeesShare}
                handleOnChangeShare={(e) => handleOnChangeShare(e, 'existing')}
                handleShareUpdate={() => handleShareUpdate('existing')}
              />
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

function ShareList({
  updatedManagerShare,
  managerShare,
  employees,
  employeesShare,
  handleOnChangeShare,
  handleShareUpdate,
}) {
  return (
    <>
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
        {employees?.map((member) => (
          <ListItem key={member.uid} alignItems="center">
            <TextField
              onChange={handleOnChangeShare}
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
      <WarehouseButton onClick={handleShareUpdate} text="Update" />
    </>
  );
}
