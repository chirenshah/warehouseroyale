import { useState } from 'react';
// Material Components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Components
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
// Css
import './RecruitmentRoom.css';

export default function RecruitmentRoom() {
  const [employeeToBeHired, setEmployeeToBeHired] = useState(null);
  const [share, setShare] = useState(null);
  const [employeeToBeFired, setEmployeeToBeFired] = useState(null);

  const handleMakeAnOffer = () => {
    console.log(employeeToBeHired, share);
  };

  const handleDeactivate = () => {
    console.log('deactivate');
  };

  const handleFireEmployee = () => {
    console.log(employeeToBeFired);
  };

  return (
    <div className="recruitmentRoom">
      {/* ------------------------------ Hire employee ------------------------------ */}
      <WarehouseHeader title="Hire employee" />
      <WarehouseCard className="recruitmentRoom__hireEmployee">
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-filled-label">Employee</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={employeeToBeHired}
            label="Round"
            onChange={(e) => setEmployeeToBeHired(e.target.value)}
          >
            {new Array(10).fill('Employee').map((elm, index) => (
              <MenuItem key={index} value={elm}>
                {elm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-filled-label">Share</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={share}
            label="Round"
            onChange={(e) => setShare(e.target.value)}
          >
            {new Array(10).fill('10%').map((elm, index) => (
              <MenuItem key={index} value={elm}>
                {elm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <WarehouseButton onClick={handleMakeAnOffer} text="Make an Offer" />
      </WarehouseCard>

      {/* ------------------------------ Active offers ------------------------------ */}
      <WarehouseHeader title="Active offers" my />
      <WarehouseCard>
        {new Array(3).fill('Employee').map((elm, index) => (
          <div key={index} className="recruitmentRoom__activeOffer">
            <h4>{elm}</h4>
            <WarehouseButton
              onClick={handleDeactivate}
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
