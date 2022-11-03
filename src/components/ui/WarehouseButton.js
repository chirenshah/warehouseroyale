import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';

export default function WarehouseButton({
  text,
  sm,
  success,
  warning,
  loading,
  ...rest
}) {
  const warehouseButtonStyle = {
    border: 'none',
    borderRadius: '0.3rem',
    padding: `${sm ? '0.3125rem 1rem' : '0.625rem 1rem'}`,
    backgroundColor: `${
      loading ? 'grey' : success ? '#3bb077' : warning ? '#ea1010' : '#3f51b5'
    }`,
    color: '#ffffff',
    cursor: `${loading ? 'unset' : 'pointer'}`,
  };

  return (
    <Box sx={{ m: 1, position: 'relative' }}>
      <button {...rest} style={warehouseButtonStyle} disabled={loading}>
        {text}
      </button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
}

WarehouseButton.propTypes = {
  text: PropTypes.string.isRequired,
  sm: PropTypes.bool,
  success: PropTypes.bool,
};

WarehouseButton.defaultProps = {
  sm: false,
  success: false,
};
