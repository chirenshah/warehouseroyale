import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';

export default function WarehouseAlert({ text, severity, ...rest }) {
  return (
    <Alert {...rest} severity={severity}>
      {text}
    </Alert>
  );
}

WarehouseAlert.propTypes = {
  text: PropTypes.string.isRequired,
  severity: PropTypes.string,
};

WarehouseAlert.defaultProps = {
  severity: 'info',
};
