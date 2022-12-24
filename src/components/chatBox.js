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
import { chat_sendMessage } from '../Database/firestore';
import { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { azAZ } from '@mui/material/locale';
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
  const q = query(
    collection(db, 'instance1', 'Room 1', 'Chats'),
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
          }}
        >
          <input
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
              chat_sendMessage(message, 'Everyone');
              setMessage('');
            }}
          ></AiOutlineSend>
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
