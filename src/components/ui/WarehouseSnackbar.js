import { useState } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';

export default function WarehouseSnackbar({ text }) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      onClose={() => setOpen(false)}
      message={text}
      key={'top' + 'right'}
      autoHideDuration={6000}
    />
  );
}

WarehouseSnackbar.propTypes = {
  text: PropTypes.string.isRequired,
};

WarehouseSnackbar.defaultProps = {
  text: 'Something went wrong',
};
