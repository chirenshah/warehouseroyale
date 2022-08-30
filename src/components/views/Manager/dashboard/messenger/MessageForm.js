import React from "react";
import Attachment from "./images/svg/Attachment";
import { useStateContext } from '../contexts/ContextProvider';

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  const { currentColor } = useStateContext();
  return (
    <div className="message_bottom" style={{ backgroundColor: currentColor }}>
      <form className="message_form" onSubmit={handleSubmit}>
        <label htmlFor="img">
          <Attachment />
        </label>
        <input
          onChange={(e) => setImg(e.target.files[0])}
          type="file"
          id="img"
          accept="image/*"
          style={{ display: "none" }}
        />
        <div>
          <input
            type="text"
            placeholder="Enter message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <button className="btn">Send</button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
