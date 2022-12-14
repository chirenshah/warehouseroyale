import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function WarehouseLoader({ sm, left }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: left ? 'flex-start' : 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={sm ? 20 : 40} />
    </Box>
  );
}

WarehouseLoader.propTypes = {
  sm: PropTypes.bool,
  left: PropTypes.bool,
};

WarehouseLoader.defaultProps = {
  sm: false,
  left: false,
};
