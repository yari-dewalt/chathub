// @ts-nocheck
import DMHeader from "../components/DMHeader";
import Message from "../components/Message";
import MessageArea from "../components/MessageArea";

import { socket } from "../socket";
import { UserContext } from "../App";

import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

function DirectMessage() {
  const { user, token } = useContext(UserContext);
  const { conversationId } = useParams();
  const [conversationData, setConversationData] = useState<Conversation>({});
  const [messages, setMessages] = useState<Message>([]);

  let correctUser;
  if (conversationData.user1 && conversationData.user1._id === user._id) {
    correctUser = conversationData.user2;
  } else {
    correctUser = conversationData.user1;
  }

  function handleConversationData(newData) {
    setConversationData(newData);
  }

  function handleMessages(newMessages) {
    setMessages(newMessages);
  }

  useEffect(() => {
    socket.on("message", handleNewMessage);
    socket.on("delete message", handleDeleteMessage);
    socket.on("edit message", handleEditMessage);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("delete message", handleDeleteMessage);
      socket.on("edit message", handleEditMessage);
    }
  }, []);

  function handleNewMessage(newMessage) {
    if (newMessage.user._id !== user._id)
      setMessages(prevMessages => [newMessage, ...prevMessages]);
  }

  function handleDeleteMessage(message) {
    setMessages(prevMessages => prevMessages.filter(msg => msg._id !== message._id));
  }

  function handleEditMessage(editedMessage) {
    setMessages(prevMessages => prevMessages.map(msg => msg._id === editedMessage._id ? editedMessage : msg));
  }

  useEffect(() => {
    async function fetchConversation() {
      try {
        const response = await fetch(`https://chathub-backend-v3lv.onrender.com/conversations/${conversationId}`, {
          method: "GET",
          headers : { "Content-Type": "application/json",
                      "Authorization": token
          },
        });

        let content: Conversation = await response.json();
        content.messages = content.messages.reverse();
        setConversationData(content);
        setMessages(content.messages);
        socket.emit("join conversation", content._id);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }

    fetchConversation();
  }, [conversationId]);

  return (
    <div className="grow flex flex-col overflow-x-hidden max-h-screen">
      <DMHeader user={correctUser || {}}/>
      <div className="flex flex-col grow justify-between">
        <div className="flex flex-col-reverse grow max-h-[86vh] phone:max-h-[79vh] gap-4 overflow-y-auto">
          {messages && messages.map((message) =>
            (<Message key={message._id} conversationData={conversationData} handleConversationData={handleConversationData} message={message}/>)
          )}
        </div>
        <MessageArea conversationData={conversationData} messages={messages} handleMessages={handleMessages}/>
      </div>
    </div>
  )
}

export default DirectMessage;
