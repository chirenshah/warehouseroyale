import WarehouseCircularPercentage from '../../../../components/ui/WarehouseCircularPercentage';
import './MessagesCard.css';

export default function MessagesCard({
  messages: { team, sent, received, percentage },
  color,
}) {
  return (
    <div className="messagesCard" style={{ backgroundColor: color }}>
      <div className="messagesCard__wrapper">
        <div className="messagesCard__desc">
          <h4>{team}</h4>
          <p>
            Sent: <em>{sent}</em>
          </p>
          <p>
            Received: <em>{received}</em>
          </p>
          <p>
            Profit: <em>{'formula'}</em>
          </p>
        </div>
        <div className="messagesCard__percentage">
          <WarehouseCircularPercentage
            value={percentage}
            text={`${percentage}%`}
            color={color}
          />
        </div>
      </div>
    </div>
  );
}
