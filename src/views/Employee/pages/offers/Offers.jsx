// Hooks
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useDocument } from '../../../../hooks/useDocument';
// Components
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
// Consttants
import { COLLECTION_USERS } from '../../../../utils/constants';
// Css
import './Offers.css';
import { acceptOffer, declineOffer } from './helpers';

export default function Offers() {
  const { user } = useAuthContext();

  const {
    document: employee,
    isPending: isEmployeePending,
    error: employeeError,
  } = useDocument(COLLECTION_USERS, user?.uid);

  const handleAcceptOffer = async (offer) => {
    await acceptOffer(employee.uid, offer.teamId, offer);
  };

  const handleDeclineOffer = async (offer) => {
    await declineOffer(employee.uid, offer.teamId, offer);
  };

  return (
    <div className="offers">
      {/* ------------------------------ Active offers ------------------------------ */}
      <WarehouseHeader title="Active offers" />
      <WarehouseCard>
        <div className="offers__activeOffer">
          <div>
            {employee?.offers?.map(({ teamId, share }, index) => (
              <div key={index}>
                <h3>
                  {index + 1}. You are offered a position at Team {teamId} for{' '}
                  {share}% share in organization
                </h3>
                <div className="offers__acceptDecline">
                  <WarehouseButton
                    onClick={() => handleAcceptOffer({ teamId, share })}
                    text="Accept"
                    success
                  />
                  <WarehouseButton
                    onClick={() => handleDeclineOffer({ teamId, share })}
                    text="Decline"
                    warning
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </WarehouseCard>

      {/* ------------------------------ Past offers ------------------------------ */}
      <WarehouseHeader title="Past offers" my />
      <WarehouseCard>
        {employee?.pastOffers?.map(({ teamId, share }, index) => (
          <h3 key={index}>
            {index + 1}. At Team {teamId} for {share}% share
          </h3>
        ))}
      </WarehouseCard>
    </div>
  );
}
