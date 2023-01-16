import {
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import '../style/chatBox.css';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import app from '../Database/config';
import { chat_sendMessage, unsub } from '../Database/firestore';
import { useEffect, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';

export function ChatBox({ expand }) {
  const [message, setMessage] = useState('');
  const db = getFirestore(app);
  let email = JSON.parse(localStorage.getItem('warehouse_user')).email;
  // setDoc(doc(db, 'instance1', 'Room 1', 'Chats'), {
  //   text: message,
  //   sender: email,
  //   receiver: 'Everyone',
  //   createdAt: new Date().getTime(),
  // });

  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  // let list = getDocs(doc(db, user_info.classId, 'Team ' + user_info.teamId)).get("userList");
  const q = query(
    collection(db, user_info.classId, 'Team ' + user_info.teamId, 'Chats'),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  let [messages] = useCollectionData(q, { idField: 'id' });
  return (
    <>
      <main
        style={{
          height: expand ? '0' : '80vh',
          padding: expand ? '0' : '10px',
          overflowX: 'Hidden',
          width: '90%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>
            <input
              style={{ width: '80%' }}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              value={message}
            />
            <AiOutlineSend
              width={10}
              fontSize={30}
              color="#6649b8"
              onClick={() => {
                chat_sendMessage(message);
                setMessage('');
              }}
            ></AiOutlineSend>
          </div>
        </div>
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={msg.createdAt} message={msg} />
          ))}
      </main>
    </>
  );
}

function ChatMessage({ message }) {
  const { text, sender, receiver, createdAt } = message;
  let email = JSON.parse(localStorage.getItem('warehouse_user')).email;
  const messageClass = sender === email ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <p style={{ margin: 4 }}>
          {!(sender === email) ? (
            <span
              style={{
                fontWeight: 'bolder',
                margin: 5,
              }}
            >
              {sender.split('@')[0]}:
            </span>
          ) : null}
          {text}
        </p>
      </div>
    </>
  );
}
