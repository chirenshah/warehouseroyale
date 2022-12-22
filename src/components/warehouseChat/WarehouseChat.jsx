import { useState, useEffect } from 'react';
// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
// Components
import WarehouseSnackbar from '../ui/WarehouseSnackbar';
import WarehouseLoader from '../ui/WarehouseLoader';
// Material icons
import { MdModeEdit } from 'react-icons/md';
import { MdOutlineArrowBackIos } from 'react-icons/md';
// Components
import WarehouseButton from '../ui/WarehouseButton';
import WarehouseCard from '../ui/WarehouseCard';
// Firebase services
import {
  fetchChatMembers,
  initiateChat,
} from '../../Database/firestoreService';
// Helpers
import { messages } from './helpers';
import { getUsersList } from './helpers/getUsersList';
// Constants
import { COLLECTION_TEAMS } from '../../utils/constants';
// Css
import './WarehouseChat.css';
import WarehouseChatSidebar from './WarehouseChatSidebar';

export default function WarehouseChat() {
  const { user: currentUser } = useAuthContext();
  const { response, callFirebaseService } = useFirestore();

  const {
    document: chatMembers,
    isPending: chatMembersPending,
    error: chatMembersError,
  } = response ?? null;

  const [text, setText] = useState('');

  const handleSubmit = async () => {
    // TODO: Perform db operations
    console.log(text);
  };

  useEffect(() => {
    (async () => {
      await callFirebaseService(fetchChatMembers(currentUser.email));
    })();
  }, []);

  return (
    <WarehouseCard className="warehouseChat__warehouseCard">
      <div className="warehouseChat">
        {chatMembersError && <WarehouseSnackbar text={chatMembersError} />}
        {/* ------------------------------ Chat sidebar ------------------------------ */}
        <WarehouseChatSidebar
          chatMembers={chatMembers}
          chatMembersPending={chatMembersPending}
        />
        {/* ------------------------------ Chat box ------------------------------ */}
        <div className="warehouseChat__right">
          <div className="warehouseChat__rightHeader">
            <div className="warehouseChat__user">
              <img
                src={'/assets/anonymous.png'}
                alt={'chat avatar'}
                className="warehouseChat__userImage"
              />{' '}
              <span>Het Mendapara</span>
            </div>
          </div>
          <div className="warehouseChat__rightChat">
            {messages.map(({ id, text }, index) => (
              <Message key={index} id={id} text={text} />
            ))}
          </div>
          <div className="warehouseChat__input">
            <input onChange={(e) => setText(e.target.value)} type="text" />
            <WarehouseButton text="Send" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </WarehouseCard>
  );
}

const Message = ({ text, id }) => {
  return (
    <div className={`warehouseChat__message ${id === 1 ? 'right' : ''}`}>
      <span>{text}</span>
    </div>
  );
};
