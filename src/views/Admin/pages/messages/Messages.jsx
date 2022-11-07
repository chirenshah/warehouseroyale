// Material components
import Grid from '@mui/material/Grid';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import MessagesCard from '../../components/messages/MessagesCard';
// Utils
import { getRandomHsl } from '../../../../utils/functions/getRandomHsl';
// Css
import './Messages.css';
import messages from '../../../../mockData/messages.json';
import WarehouseCard from '../../../../components/ui/WarehouseCard';

export default function Messages() {
  return (
    <div className="messages">
      <WarehouseHeader title="Messages" />
      <WarehouseCard>
        <Grid container spacing={2}>
          {messages.map((elm) => (
            <Grid key={elm.id} item xs={12} md={4}>
              <MessagesCard messages={elm} color={getRandomHsl()} />
            </Grid>
          ))}
        </Grid>
      </WarehouseCard>
    </div>
  );
}
