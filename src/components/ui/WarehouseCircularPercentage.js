import PropTypes from 'prop-types';
// Material Components
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function WarehouseCircularPercentage({ value, text, color }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        thickness={6}
        sx={{ color }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

WarehouseCircularPercentage.propTypes = {
  value: PropTypes.number,
  text: PropTypes.string,
  color: PropTypes.string,
};

WarehouseCircularPercentage.defaultProps = {
  value: 100,
  text: '100%',
  color: 'steelblue',
};
