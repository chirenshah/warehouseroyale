import { useState } from 'react';
// Material icons
import { MdModeEdit } from 'react-icons/md';
// Components
import WarehouseButton from '../ui/WarehouseButton';
import WarehouseCard from '../ui/WarehouseCard';
// Helpers
import { users, messages } from './helpers';
// Css
import './Chat.css';

export default function Chat() {
  const [text, setText] = useState('');
  const [activeChatMember, setActiveChatMember] = useState('Het Mendapara');

  const handleSubmit = async () => {
    // TODO: Perform db operations
    console.log(text);
  };

  return (
    <WarehouseCard className="chat__warehouseCard">
      <div className="chat">
        <div className="chat__left">
          <div className="chat__leftHeader">
            <h3>Chats</h3>
            <MdModeEdit />
          </div>
          <div className="chat__leftList">
            {users.map(({ name, id }) => (
              <ChatMember
                key={id}
                name={name}
                activeChatMember={activeChatMember}
                setActiveChatMember={setActiveChatMember}
              />
            ))}
          </div>
        </div>

        <div className="chat__right">
          <div className="chat__rightHeader">
            <div className="chat__user">
              <img
                src={'/assets/anonymous.png'}
                alt={'chat avatar'}
                className="chat__userImage"
              />{' '}
              <span>Het Mendapara</span>
            </div>
          </div>
          <div className="chat__rightChat">
            {messages.map(({ id, text }, index) => (
              <Message id={id} text={text} />
            ))}
          </div>
          <div className="chat__input">
            <input onChange={(e) => setText(e.target.value)} type="text" />
            <WarehouseButton text="Send" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </WarehouseCard>
  );
}

const ChatMember = ({ name, activeChatMember, setActiveChatMember }) => {
  return (
    <div
      onClick={() => setActiveChatMember(name)}
      className={`chat__user ${activeChatMember === name && 'active'}`}
    >
      <img
        src={'/assets/anonymous.png'}
        alt={'chat avatar'}
        className="chat__userImage"
      />{' '}
      <span>{name}</span>
    </div>
  );
};

const Message = ({ text, id }) => {
  return (
    <div className={`chat__message ${id === 1 ? 'right' : ''}`}>
      <span>{text}</span>
    </div>
  );
};
