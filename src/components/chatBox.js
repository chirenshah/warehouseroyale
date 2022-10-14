import {
    collection,
    getFirestore,
    limit,
    orderBy,
    query,
} from "firebase/firestore";
import "../style/chatBox.css";

import { useCollectionData } from "react-firebase-hooks/firestore";
import app from "../Database/config";
export function ChatBox({ expand }) {
    const db = getFirestore(app);
    const q = query(
        collection(db, "instance1", "Room 1", "Chats"),
        orderBy("createdAt", "desc"),
        limit(100)
    );

    let [messages] = useCollectionData(q, { idField: "id" });

    return (
        <>
            <main
                style={{
                    height: expand ? "0" : "80vh",
                    padding: expand ? "0" : "10px",
                    overflow: "scroll",
                }}
            >
                {messages &&
                    messages.map((msg) => (
                        <ChatMessage key={msg.createdAt} message={msg} />
                    ))}
            </main>
        </>
    );
}

function ChatMessage({ message }) {
    const { text, user, createdAt } = message;

    const messageClass =
        user === window.localStorage.admin ? "sent" : "received";

    return (
        <>
            <div className={`message ${messageClass}`}>
                <p>{text}</p>
            </div>
        </>
    );
}
