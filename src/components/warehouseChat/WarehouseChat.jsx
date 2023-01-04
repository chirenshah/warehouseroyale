import { useState, useEffect, useRef } from 'react';
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
// Firebase services
import { addChat } from '../../Database/firestoreService';
// Constants
import { COLLECTION_CHATS } from '../../utils/constants';
// Css
import './WarehouseChat.css';

export default function WarehouseChat() {
  const lastMessageRef = useRef(null);

  const { user: currentUser } = useAuthContext();

  const { response, callFirebaseService } = useFirestore();

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

    await callFirebaseService(
      addChat(currentUser.email, activeChatMember, {
        sender: currentUser.email,
        text,
      })
    );

    setText('');
  };

  useEffect(() => {
    // Scroll to latest message
    lastMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, [conversations]);

  const loadNewChatMember = (newChatMember) => {
    chatMembers.unshift(newChatMember);
  };

  return (
    <WarehouseCard className="warehouseChat__warehouseCard">
      <div className="warehouseChat">
        {(chatMembersError || conversationsError || response.error) && (
          <WarehouseSnackbar
            text={chatMembersError || conversationsError || response.error}
          />
        )}
        {/* ------------------------------ Chat sidebar ------------------------------ */}
        <WarehouseChatSidebar
          currentUser={currentUser}
          classId={currentUser.classId}
          chatMembers={chatMembers}
          chatMembersPending={chatMembersPending}
          activeChatMember={activeChatMember}
          setActiveChatMember={setActiveChatMember}
          loadNewChatMember={loadNewChatMember}
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
              <div className="warehouseChat__messagesWrapper">
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
              </div>
            )}
          </div>
          <div className="warehouseChat__input">
            <input
              onChange={(e) => setText(e.target.value)}
              value={text}
              type="text"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit(event);
                }
              }}
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
