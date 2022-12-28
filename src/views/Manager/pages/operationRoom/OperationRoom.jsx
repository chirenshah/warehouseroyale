import { useAuthContext } from '../../../../hooks/useAuthContext';
import OperationRoomComp from '../../../../components/OperationRoom/OperationRoomComp';

export default function OperationRoom() {
  const { user } = useAuthContext();

  return <OperationRoomComp currentUser={user} />;
}
