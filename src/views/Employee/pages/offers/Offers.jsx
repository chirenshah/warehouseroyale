// Components
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
// Css

import './Offers.css';

export default function Offers() {
  return (
    <div className="offers">
      {/* ------------------------------ Active offers ------------------------------ */}
      <WarehouseHeader title="Active offers" />
      <WarehouseCard>
        <div className="offers__activeOffer">
          <h3>1.</h3>
          <div>
            <h3>
              You are offered a position at Team X for X% share in organization
            </h3>
            <div className="offers__acceptDecline">
              <WarehouseButton text="Accept" success />
              <WarehouseButton text="Decline" warning />
            </div>
          </div>
        </div>
      </WarehouseCard>

      {/* ------------------------------ Past offers ------------------------------ */}
      <WarehouseHeader title="Past offers" my />
      <WarehouseCard>
        <h3>1. At Team V for J% share</h3>
      </WarehouseCard>
    </div>
  );
}
