import { useState, useRef } from 'react';
// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
// Components
import WarehouseSnackbar from '../ui/WarehouseSnackbar';
import WarehouseLoader from '../ui/WarehouseLoader';
// Components
import WarehouseChatSidebar from './WarehouseChatSidebar';
import WarehouseButton from '../ui/WarehouseButton';
import WarehouseCard from '../ui/WarehouseCard';
// Constants
import { COLLECTION_CHATS } from '../../utils/constants';
// Css
import './WarehouseChat.css';
import { useEffect } from 'react';

export default function WarehouseChat() {
  const lastMessageRef = useRef(null);

  const { user: currentUser } = useAuthContext();

  const { response, addDocument } = useFirestore();

  const [activeChatMember, setActiveChatMember] = useState(null);
  const [text, setText] = useState('');

  const {
    documents: chatMembers,
    isPending: chatMembersPending,
    error: chatMembersError,
  } = useCollection(`${COLLECTION_CHATS}/${currentUser.email}/members`);

  const {
    documents: conversations,
    isPending: conversationsPending,
    error: conversationsError,
  } = useCollection(
    `${COLLECTION_CHATS}/${currentUser.email}/members/${activeChatMember}/conversations`,
    null,
    ['createdAt', 'asc'],
    true
  );

  const handleSubmit = async () => {
    // TODO: Perform db operations
    if (!text.length) return;

    await addDocument(
      COLLECTION_CHATS,
      `${currentUser.email}/members/${activeChatMember}/conversations`,
      {
        sender: currentUser.email,
        text,
      },
      true
    );

    setText('');
  };

  useEffect(() => {
    // Scroll to latest message
    lastMessageRef.current?.scrollIntoView();
  }, [conversations]);

  return (
    <WarehouseCard className="warehouseChat__warehouseCard">
      <div className="warehouseChat">
        {chatMembersError ||
          (conversationsError && (
            <WarehouseSnackbar text={chatMembersError || conversationsError} />
          ))}
        {/* ------------------------------ Chat sidebar ------------------------------ */}
        <WarehouseChatSidebar
          chatMembers={chatMembers}
          chatMembersPending={chatMembersPending}
          activeChatMember={activeChatMember}
          setActiveChatMember={setActiveChatMember}
        />
        {/* ------------------------------ Chat box ------------------------------ */}
        <div className="warehouseChat__right">
          {activeChatMember && (
            <div className="warehouseChat__rightHeader">
              <div className="warehouseChat__user">
                <img
                  src={'/assets/anonymous.png'}
                  alt={'chat avatar'}
                  className="warehouseChat__userImage"
                />{' '}
                <span>{activeChatMember}</span>
              </div>
            </div>
          )}
          <div className="warehouseChat__rightChat">
            {!activeChatMember ? (
              <div className="warehouseChat__welcomeText">
                <h3>Chat Messanger for Warehouse Royale</h3>
                <h4>Send and receive messages</h4>
              </div>
            ) : conversationsPending ? (
              <WarehouseLoader />
            ) : (
              <div className="warehouseChat__messages">
                {conversations?.map(({ id, text, createdAt, sender }) => (
                  <Message
                    key={id}
                    id={id}
                    text={text}
                    createdAt={createdAt}
                    sender={sender}
                    currentUser={currentUser}
                  />
                ))}
                <div ref={lastMessageRef}></div>
              </div>
            )}
          </div>
          <div className="warehouseChat__input">
            <input
              onChange={(e) => setText(e.target.value)}
              value={text}
              type="text"
            />
            <WarehouseButton text="Send" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </WarehouseCard>
  );
}

const Message = ({ id, text, createdAt, sender, currentUser }) => {
  return (
    <div
      className={`warehouseChat__message ${
        sender === currentUser.email ? 'right' : ''
      }`}
    >
      <span>{text}</span>
    </div>
  );
};
