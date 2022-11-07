import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
// Material components
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Alert from '@mui/material/Alert';

export default function SwitchUser() {
  const navigate = useNavigate();

  const { user, setUser } = useAuthContext();

  const handleOnClick = (user) => {
    setUser(user);
    navigate('/');
  };

  return (
    <div>
      <Alert
        variant="outlined"
        severity="warning"
        color="info"
        sx={{ marginBottom: '1rem' }}
      >
        Development mode only
      </Alert>
      <ButtonGroup variant="text" aria-label="text button group">
        <Button
          onClick={() => handleOnClick('admin')}
          color={user === 'admin' ? 'warning' : 'primary'}
        >
          Admin
        </Button>
        <Button
          onClick={() => handleOnClick('manager')}
          color={user === 'manager' ? 'warning' : 'primary'}
        >
          Manager
        </Button>
        <Button
          onClick={() => handleOnClick('employee')}
          color={user === 'employee' ? 'warning' : 'primary'}
        >
          Employee
        </Button>
      </ButtonGroup>
    </div>
  );
}
