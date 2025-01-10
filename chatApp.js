import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Listen for messages from the server
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("sendMessage", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div>
      <h1>Messaging App</h1>
      <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
