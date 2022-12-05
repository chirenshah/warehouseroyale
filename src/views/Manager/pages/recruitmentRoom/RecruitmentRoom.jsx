import { useEffect, useState } from 'react';
// Hooks
import { useAuthContext } from '../../../../hooks/useAuthContext';
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
// Firestore services
import {
  deactivateAnOffer,
  fireAnEmployee,
  makeAnOffer,
} from '../../../../Database/firestoreService';
// Helpers
import { getCurrentTeamOffer, getEmployeeDetails } from './helpers';
// Constants
import {
  COLLECTION_TEAMS,
  COLLECTION_USERS,
} from '../../../../utils/constants';
// Css
import './RecruitmentRoom.css';

export default function RecruitmentRoom() {
  const { user: manager } = useAuthContext();
  // const { team: manager.teamId } = useTeamContext();

  const [shareOffered, setShareOffered] = useState(null);

  const [employeeToBeHired, setEmployeeToBeHired] = useState('');
  const [selectedHireDetails, setSelectedHireDetails] = useState(null);
  const [employeeToBeFired, setEmployeeToBeFired] = useState('');
  const [selectedFireDetails, setSelectedFireDetails] = useState(null);

  const [currentTeamEmployees, setCurrentTeamEmployees] = useState(null);
  const [otherEmployees, setOtherEmployees] = useState(null);

  const {
    document: team,
    isPending: isTeamPending,
    error: teamError,
  } = useDocument(COLLECTION_TEAMS, manager.teamId);

  const {
    documents: allEmployees,
    isPending: areAllEmployeesPending,
    error: allEmployeesError,
  } = useCollection(COLLECTION_USERS, ['role', '==', 'employee']);

  useEffect(() => {
    if (!allEmployees?.length) {
      return;
    }

    const selectedHireDetails = getEmployeeDetails(
      allEmployees,
      employeeToBeHired
    );
    setSelectedHireDetails(selectedHireDetails);

    const selectedFireDetails = getEmployeeDetails(
      allEmployees,
      employeeToBeFired
    );
    setSelectedFireDetails(selectedFireDetails);

    const currentTeamEmployees = allEmployees?.filter(
      (member) => member.teamId === manager.teamId
    );
    setCurrentTeamEmployees(currentTeamEmployees);

    const otherEmployees = allEmployees?.filter(
      (member) => member.teamId !== manager.teamId
    );
    setOtherEmployees(otherEmployees);
  }, [allEmployees, employeeToBeHired, employeeToBeFired, manager.teamId]);

  const handleMakeAnOffer = async () => {
    // TODO: Put validations

    await makeAnOffer(employeeToBeHired, manager.teamId, {
      share: shareOffered,
      teamId: manager.teamId,
    });
  };

  const handleDeactivate = async (employeeId, currentTeamOffer) => {
    await deactivateAnOffer(employeeId, manager.teamId, currentTeamOffer);
  };

  const handleFireEmployee = async () => {
    await fireAnEmployee(
      employeeToBeFired,
      manager.teamId,
      manager.email,
      selectedFireDetails.share
    );
  };

  return (
    <div className="recruitmentRoom">
      {/* ------------------------------ Hire employee ------------------------------ */}
      <WarehouseHeader title="Hire employee" />
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <WarehouseCard className="recruitmentRoom__hireEmployee">
          {areAllEmployeesPending && <WarehouseLoader />}
          {allEmployeesError && <WarehouseSnackbar text={allEmployeesError} />}
          {otherEmployees?.length && (
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Select Employee</InputLabel>
              <Select
                value={employeeToBeHired}
                label="Round"
                onChange={(e) => setEmployeeToBeHired(e.target.value)}
              >
                {otherEmployees.map(({ fullName, id }) => (
                  <MenuItem key={id} value={id}>
                    {fullName}
                  </MenuItem>
                ))}
              </Select>
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
              <strong>Team:</strong> <em>{selectedHireDetails?.teamId}</em>
            </p>
            <p>
              <strong>Current share in Team:</strong>{' '}
              <em>{selectedHireDetails?.share}</em>
            </p>
          </WarehouseCard>
        )}
      </Box>

      {/* ------------------------------ Active offers ------------------------------ */}
      <WarehouseHeader title="Active offers" my />
      <WarehouseCard>
        {team?.offers?.map((employee) => (
          <div key={employee.email} className="recruitmentRoom__activeOffer">
            <h4>{getEmployeeDetails(allEmployees, employee.email).fullName}</h4>
            <WarehouseButton
              onClick={() =>
                handleDeactivate(
                  employee.email,
                  getCurrentTeamOffer(
                    allEmployees,
                    employee.email,
                    manager.teamId
                  )
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
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <WarehouseCard className="recruitmentRoom__downsize">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Employee</InputLabel>
            <Select
              value={employeeToBeFired}
              label="Round"
              onChange={(e) => setEmployeeToBeFired(e.target.value)}
            >
              {currentTeamEmployees?.map((member, index) => (
                <MenuItem key={index} value={member.email}>
                  {member.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <WarehouseButton
            onClick={handleFireEmployee}
            text="Fire an employee"
          />
        </WarehouseCard>
        {employeeToBeFired && (
          <WarehouseCard>
            <p>
              <strong>Team:</strong> <em>{selectedFireDetails?.teamId}</em>
            </p>
            <p>
              <strong>Current share in Team:</strong>{' '}
              <em>{selectedFireDetails?.share}</em>
            </p>
          </WarehouseCard>
        )}
      </Box>
    </div>
  );
}
