import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Hooks
import { useCollection } from '../../../../hooks/useCollection';
import { useFirestore } from '../../../../hooks/useFirestore';
// Material components
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
// React Icons
import { MdDelete, MdOutlineFileUpload } from 'react-icons/md';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseSnackbar from '../../../../components/ui/WarehouseSnackbar';
import WarehouseAlert from '../../../../components/ui/WarehouseAlert';
import WarehouseConfirmationPopup from '../../../../components/ui/WarehouseConfirmationPopup';
// Firestore services
import {
  createNewUsers,
  deleteEmployee,
  deleteManager,
  deleteManagerAndPromoteEmployee,
} from '../../../../Database/firestoreService';
// Utils
import { parseExcel } from '../../../../utils/functions/parseExcel';
// Constants
import { COLLECTION_USERS } from '../../../../utils/constants';
// Css
import './UserList.css';

export default function UserList() {
  const {
    documents: users,
    isPending,
    error,
  } = useCollection(
    COLLECTION_USERS,
    [{ fieldPath: 'role', queryOperator: '!=', value: 'admin' }],
    ['role', 'desc']
  );

  const { response, callFirebaseService } = useFirestore();
  const {
    response: newUsersResponse,
    callFirebaseService: callCreateNewUsers,
  } = useFirestore();

  const [userDetails, setUserDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetValidationError, setSheetValidationError] = useState(null);

  const fileTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ];

  const handleDelete = async (userDetails) => {
    if (userDetails.role === 'employee') {
      await callFirebaseService(deleteEmployee(userDetails));

      handleClosePopup();
    } else {
      handleOpenModal();
    }
  };

  const handleOnFileChange = (e) => {
    let selected = e.target.files[0];
    if (selected && fileTypes.includes(selected.type)) {
      setFile(selected);
      setFileError(null);
    } else {
      setFile(null);
      setFileError('Please select a valid excel file');
    }
  };

  const handleFileUpload = async () => {
    try {
      const usersJson = await parseExcel(file);
      await callCreateNewUsers(createNewUsers(usersJson));
    } catch (error) {
      console.error('Error: ', error);
      setSheetValidationError(error.message);
    }
  };

  // Popover-----------------------------------------------------------
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e, userDetails) => {
    setAnchorEl(e.currentTarget);
    setUserDetails(userDetails);
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  // Popover-----------------------------------------------------------

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'username',
      headerName: 'User',
      width: 180,
      renderCell: (params) => {
        return (
          <div className="userList__user">
            <img
              className="userList__avatar"
              src={params.row.avatar || '/assets/anonymous.png'}
              alt={params.row.username}
            />
            {params.row.username}
          </div>
        );
      },
    },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'classId',
      headerName: 'Class ID',
      width: 120,
    },
    {
      field: 'teamId',
      headerName: 'Team ID',
      width: 120,
    },
    {
      field: 'role',
      headerName: 'Employee Type',
      width: 170,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={'/users/' + params.row.id}>
              <WarehouseButton text="Edit" sm success />
            </Link>
            <MdDelete
              aria-describedby={id}
              className="userList__delete"
              onClick={(e) => handleClick(e, params.row)}
            />
            <WarehouseConfirmationPopup
              anchorEl={anchorEl}
              userDetails={userDetails}
              handleDelete={handleDelete}
              handleClosePopup={handleClosePopup}
              response={response}
            />
          </>
        );
      },
    },
  ];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="userList">
      {isPending ? (
        <WarehouseLoader />
      ) : error ? (
        <WarehouseAlert text={error} />
      ) : (
        <>
          <WarehouseHeader>
            <Link to="/new-user">
              <WarehouseButton text="Create new user" />
            </Link>{' '}
          </WarehouseHeader>
          <WarehouseCard>
            <Box sx={{ height: 450, width: '100%' }}>
              {
                <DataGrid
                  rows={users}
                  columns={columns}
                  pageSize={6}
                  rowsPerPageOptions={[6]}
                  checkboxSelection
                  disableSelectionOnClick
                />
              }
            </Box>
          </WarehouseCard>
        </>
      )}

      <WarehouseHeader title="Upload an Excel Sheet instead!" my />
      <WarehouseCard>
        {(newUsersResponse.error || sheetValidationError) && (
          <WarehouseAlert
            text={newUsersResponse.error || sheetValidationError}
            severity="error"
          />
        )}
        <div className="userList__upload">
          <label>
            <input type="file" onChange={handleOnFileChange} />
            <MdOutlineFileUpload className="userList__uploadIcon" />
          </label>
          <h3>Select file</h3>
          {file && <p>{file.name}</p>}
          {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
          <WarehouseButton
            onClick={handleFileUpload}
            loading={newUsersResponse.isPending}
            disabled={!file}
            text="Upload file"
          />
        </div>
      </WarehouseCard>
      {isModalOpen && (
        <DeleteManagerModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          handleClosePopup={handleClosePopup}
          manager={userDetails}
          response={response}
          callFirebaseService={callFirebaseService}
        />
      )}
    </div>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
};
function DeleteManagerModal({
  isModalOpen,
  handleCloseModal,
  handleClosePopup,
  manager,
  response,
  callFirebaseService,
}) {
  const {
    documents: teamMembers,
    isPending: areTeamMembersPending,
    error: teamMembersError,
  } = useCollection(COLLECTION_USERS, [
    { fieldPath: 'teamId', queryOperator: '==', value: manager.teamId },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState('');

  const handleSubmit = async () => {
    if (teamMembers.length > 1 && selectedEmployee === '') return;

    if (selectedEmployee === '' && teamMembers.length === 1) {
      await callFirebaseService(deleteManager(manager));

      handleCloseModal();
    } else {
      const employee = teamMembers.find(
        (member) => member.fullName === selectedEmployee
      );

      await callFirebaseService(
        deleteManagerAndPromoteEmployee(manager, employee)
      );

      handleCloseModal();
    }

    handleCloseModal();
  };

  useEffect(() => {
    // Close popup as soon as modal opens
    handleClosePopup();
  }, []);

  return (
    <>
      {(teamMembersError || response.error) && (
        <WarehouseSnackbar text={response.error} />
      )}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {areTeamMembersPending ? (
          <WarehouseLoader />
        ) : (
          <Box sx={style}>
            <WarehouseCard>
              {teamMembers?.length === 1 || teamMembers?.length === 0 ? (
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Manager has no employees in his team. You can submit to
                  delete.
                </Typography>
              ) : (
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Choose one of the employees to promote before you delete the
                  manager.
                </Typography>
              )}
              {teamMembers?.length > 1 && (
                <select
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  value={selectedEmployee}
                  required
                >
                  <option value="" disabled selected>
                    Select an employee
                  </option>
                  {teamMembers
                    ?.filter((member) => member.role === 'employee')
                    .map((member) => (
                      <option key={member.email} value={member.fullName}>
                        {member.fullName}
                      </option>
                    ))}
                </select>
              )}

              <WarehouseButton
                text="Submit"
                onClick={handleSubmit}
                loading={response.isPending}
              />
            </WarehouseCard>
          </Box>
        )}
      </Modal>
    </>
  );
}
