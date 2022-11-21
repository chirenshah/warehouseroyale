import { useEffect, useState } from 'react';
// Hooks
import { useTeamContext } from '../../hooks/useTeamContext';
import { useDocument } from '../../../../hooks/useDocument';
import { useCollection } from '../../../../hooks/useCollection';
// Material Components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
// Components
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseSnackbar from '../../../../components/ui/WarehouseSnackbar';
// Helpers
import {
  deactivateAnOffer,
  getCurrentTeamOffer,
  getEmployeeDetails,
  makeAnOffer,
  useFetchEmployees,
} from './helpers';
// Constants
import {
  COLLECTION_TEAMS,
  COLLECTION_USERS,
} from '../../../../utils/constants';
// Css
import './RecruitmentRoom.css';

export default function RecruitmentRoom() {
  const { team: currentTeamId } = useTeamContext();

  const [employeeToBeHired, setEmployeeToBeHired] = useState(null);
  const [employeeToBeHiredError, setEmployeeToBeHiredError] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [shareOffered, setShareOffered] = useState(null);
  const [employeeToBeFired, setEmployeeToBeFired] = useState('');

  const { share, teamId } = employeeDetails ?? {};

  const {
    document: team,
    isPending: isTeamPending,
    error: teamError,
  } = useDocument(COLLECTION_TEAMS, currentTeamId);

  // TODO: It's temporary hook. Make useCollection hook to accept multiple where queries
  const {
    documents: allEmployees,
    isPending: areAllEmployeesPending,
    error: allEmployeesError,
  } = useFetchEmployees(COLLECTION_USERS, currentTeamId || 'noId');

  useEffect(() => {
    const employeeDetails = getEmployeeDetails(allEmployees, employeeToBeHired);

    setEmployeeDetails(employeeDetails);
  }, [allEmployees, employeeToBeHired]);

  const handleMakeAnOffer = async () => {
    // TODO: Put validations

    await makeAnOffer(employeeToBeHired, currentTeamId, {
      share: shareOffered,
      teamId: currentTeamId,
    });
  };

  const handleDeactivate = async (employeeId, currentTeamOffer) => {
    await deactivateAnOffer(employeeId, currentTeamId, currentTeamOffer);
  };

  const handleFireEmployee = () => {
    console.log(employeeToBeFired);
  };

  return (
    <div className="recruitmentRoom">
      {/* ------------------------------ Hire employee ------------------------------ */}
      <WarehouseHeader title="Hire employee" />
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <WarehouseCard className="recruitmentRoom__hireEmployee">
          {areAllEmployeesPending && <WarehouseLoader />}
          {allEmployeesError && <WarehouseSnackbar text={allEmployeesError} />}
          {allEmployees?.length && (
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel id="demo-simple-select-filled-label">
                Select Employee
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={employeeToBeHired}
                label="Round"
                onChange={(e) => setEmployeeToBeHired(e.target.value)}
              >
                {allEmployees.map(({ fullName, id }) => (
                  <MenuItem key={id} value={id}>
                    {fullName}
                  </MenuItem>
                ))}
              </Select>
              {employeeToBeHiredError && (
                <span className="inputError">{employeeToBeHiredError}</span>
              )}
            </FormControl>
          )}
          <TextField
            onChange={(e) => setShareOffered(e.target.value)}
            value={shareOffered}
            type="number"
          />
          <WarehouseButton onClick={handleMakeAnOffer} text="Make an Offer" />
        </WarehouseCard>
        {employeeToBeHired && (
          <WarehouseCard>
            <p>
              <strong>Team:</strong> <em>{teamId}</em>
            </p>
            <p>
              <strong>Current share in Team:</strong> <em>{share}</em>
            </p>
          </WarehouseCard>
        )}
      </Box>

      {/* ------------------------------ Active offers ------------------------------ */}
      <WarehouseHeader title="Active offers" my />
      <WarehouseCard>
        {team?.offers?.map((employee) => (
          <div key={employee.uid} className="recruitmentRoom__activeOffer">
            <h4>{getEmployeeDetails(allEmployees, employee.uid).fullName}</h4>
            <WarehouseButton
              onClick={() =>
                handleDeactivate(
                  employee.uid,
                  getCurrentTeamOffer(allEmployees, employee.uid, currentTeamId)
                )
              }
              text="Deactivate"
              warning
              sm
            />
          </div>
        ))}
      </WarehouseCard>

      {/* ------------------------------ Downsize the team ------------------------------ */}
      <WarehouseHeader title="Downsize the team" my />
      <WarehouseCard className="recruitmentRoom__downsize">
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-filled-label">Employee</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={employeeToBeFired}
            label="Round"
            onChange={(e) => setEmployeeToBeFired(e.target.value)}
          >
            {new Array(10).fill('Employee').map((elm, index) => (
              <MenuItem key={index} value={elm}>
                {elm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <WarehouseButton onClick={handleFireEmployee} text="Make an Offer" />
      </WarehouseCard>
    </div>
  );
}
