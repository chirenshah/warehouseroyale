export default function WarehouseCard({ children, ...rest }) {
  const warehouseCardStyle = {
    boxShadow:
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px',
    padding: '2rem',
    borderRadius: '1rem',
  };

  return (
    <div {...rest} style={warehouseCardStyle}>
      {children}
    </div>
  );
}
