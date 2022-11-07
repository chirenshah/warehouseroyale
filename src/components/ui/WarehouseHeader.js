import PropTypes from 'prop-types';

export default function WarehouseHeader({ title, my, children }) {
  const warehouseHeaderStyle = {
    margin: `${my ? '2rem 0 1rem' : '0 0 1rem'}`,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid hsl(var(--borderColor))',
  };

  return (
    <div style={warehouseHeaderStyle}>
      <h3>{title}</h3>
      {children && <div>{children}</div>}
    </div>
  );
}

WarehouseHeader.propTypes = {
  title: PropTypes.string.isRequired,
  my: PropTypes.bool,
};

WarehouseHeader.defaultProps = {
  title: '',
  my: false,
};
