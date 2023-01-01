// Hooks
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useDocument } from '../../../../hooks/useDocument';
import { useFirestore } from '../../../../hooks/useFirestore';
// Components
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseSnackbar from '../../../../components/ui/WarehouseSnackbar';
import WarehouseAlert from '../../../../components/ui/WarehouseAlert';
// Firestore services
import {
  acceptOffer,
  declineOffer,
} from '../../../../Database/firestoreService';
// Consttants
import { COLLECTION_USERS } from '../../../../utils/constants';
// Css
import './Offers.css';

export default function Offers() {
  const { user, updateUser } = useAuthContext();

  const { response, callFirebaseService } = useFirestore();

  const {
    document: employee,
    isPending: isEmployeePending,
    error: employeeError,
  } = useDocument(COLLECTION_USERS, user?.email);

  const handleAcceptOffer = async (offer) => {
    await callFirebaseService(acceptOffer(user, offer));

    updateUser({ ...user, ...offer });
  };

  const handleDeclineOffer = async (offer) => {
    await callFirebaseService(
      declineOffer(employee.email, offer.teamId, offer)
    );
  };

  return (
    <div className="offers">
      {employeeError && (
        <WarehouseAlert text={employeeError} severity="error" />
      )}
      {response.error && (
        <WarehouseSnackbar text={employeeError || response.error} />
      )}
      {/* ------------------------------ Active offers ------------------------------ */}
      <WarehouseHeader title="Active offers" />
      <WarehouseCard>
        {isEmployeePending ? (
          <WarehouseLoader />
        ) : (
          <div className="offers__activeOffer">
            {!employee?.offers?.length ? (
              <h4>No active offers</h4>
            ) : (
              employee?.offers?.map(({ teamId, share }, index) => (
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
                      loading={response.isPending}
                    />
                    <WarehouseButton
                      onClick={() => handleDeclineOffer({ teamId, share })}
                      text="Decline"
                      warning
                      loading={response.isPending}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </WarehouseCard>

      {/* ------------------------------ Past offers ------------------------------ */}
      <WarehouseHeader title="Past offers" my />
      <WarehouseCard>
        {isEmployeePending ? (
          <WarehouseLoader />
        ) : !employee?.pastOffers?.length ? (
          <h4>No past offers</h4>
        ) : (
          employee?.pastOffers?.map(({ teamId, share }, index) => (
            <h3 key={index}>
              {index + 1}. At Team {teamId} for {share}% share
            </h3>
          ))
        )}
      </WarehouseCard>
    </div>
  );
}
