import Popover from '@mui/material/Popover';
import WarehouseButton from './WarehouseButton';

export default function WarehouseConfirmationPopup({
  anchorEl,
  userDetails,
  handleDelete,
  handleClosePopup,
  response,
}) {
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClosePopup}
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
            onClick={() => handleDelete(userDetails)}
            text="Yes"
            warning
            sm
            loading={response.isPending}
          />
          <WarehouseButton
            onClick={handleClosePopup}
            text="Cancel"
            success
            sm
          />
        </div>
      </div>
    </Popover>
  );
}
