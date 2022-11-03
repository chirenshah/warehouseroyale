import { useState } from 'react';
import { Link } from 'react-router-dom';
// Material components
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
// React Icons
import { MdDelete, MdOutlineFileUpload } from 'react-icons/md';
// Components
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
// Helpers
import { users } from './helpers';
// Css
import './UserList.css';
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';

export default function UserList() {
  const [data, setData] = useState(users);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const fileTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ];

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
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

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'user',
      headerName: 'User',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userList__user">
            <img
              className="userList__avatar"
              src={params.row.avatar}
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
      field: 'employeeType',
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
              className="userList__delete"
              onClick={() => handleDelete(params.row.id)}
            />
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
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            checkboxSelection
            disableSelectionOnClick
          />
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
