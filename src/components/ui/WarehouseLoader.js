import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function WarehouseLoader() {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <CircularProgress />
    </Box>
  );
}
