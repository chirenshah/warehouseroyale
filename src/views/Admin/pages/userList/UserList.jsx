import { useState } from 'react';
import { Link } from 'react-router-dom';
// Hooks
import { useCollection } from '../../../../hooks/useCollection';
import { useFirestore } from '../../../../hooks/useFirestore';
// Material components
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import { DataGrid } from '@mui/x-data-grid';
// React Icons
import { MdDelete, MdOutlineFileUpload } from 'react-icons/md';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseSnackbar from '../../../../components/ui/WarehouseSnackbar';
import WarehouseConfirmationPopup from '../../../../components/ui/WarehouseConfirmationPopup';
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
    ['role', '!=', 'admin'],
    ['role', 'desc']
  );

  const { response, deleteDocument } = useFirestore();

  const [deleteId, setDeleteId] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const fileTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ];

  const handleDelete = async (id) => {
    await deleteDocument(COLLECTION_USERS, id);

    // TODO: Update delete functionality to delete user from authentication and teams collection

    handleClose();

    //! TODO: PROBLEM: We are deleting user from collection only and not the actual auth-user.
    //! And we cannot delete it from client-side, we must do it into safe environment(admin-sdk), that's what firebase says due to security reasons.
    //! So we must create and deploy function which listens to firestore event when "delete user" happens.
    // https://stackoverflow.com/questions/38800414/delete-a-specific-user-from-firebase
    // https://stackoverflow.com/questions/44721897/delete-firebase-authenticated-user-from-web-application/44723666#44723666
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

  const handleFileUpload = () => {
    console.log(file);
  };

  // Popover----------------------------------------------------------- // TODO: Refactor this component -> Make it separate ui component
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    setDeleteId(id);
  };

  const handleClose = () => {
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
      width: 200,
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
      field: 'teamId',
      headerName: 'Team ID',
      width: 140,
    },
    {
      field: 'role',
      headerName: 'Employee Type',
      width: 200,
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
              onClick={(e) => handleClick(e, params.row.id)}
            />
            {/* Popover----------------------------------------------------------- // TODO: Refactor this component -> Make it separate ui component */}
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.5rem',
                }}
              >
                <span>Are you sure?</span>
                <div style={{ display: 'flex' }}>
                  <WarehouseButton
                    onClick={() => handleDelete(deleteId)}
                    text="Yes"
                    warning
                    sm
                  />
                  <WarehouseButton
                    onClick={handleClose}
                    text="Cancel"
                    success
                    sm
                  />
                </div>
              </div>
            </Popover>
            {/* Popover----------------------------------------------------------- */}
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <WarehouseHeader>
        <Link to="/new-user">
          <WarehouseButton text="Create new user" />
        </Link>{' '}
      </WarehouseHeader>
      <WarehouseCard>
        <Box sx={{ height: 450, width: '100%' }}>
          {isPending && <WarehouseLoader />}
          {error && <WarehouseSnackbar text={error || response.error} />}
          {users && (
            <DataGrid
              rows={users}
              columns={columns}
              pageSize={6}
              rowsPerPageOptions={[6]}
              checkboxSelection
              disableSelectionOnClick
            />
          )}
        </Box>
      </WarehouseCard>
      <WarehouseHeader title="Upload an Excel Sheet instead!" my />
      <WarehouseCard>
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
            disabled={!file}
            text="Upload file"
          />
        </div>
      </WarehouseCard>
    </div>
  );
}
