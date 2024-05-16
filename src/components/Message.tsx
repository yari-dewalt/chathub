// @ts-nocheck
import DeleteModal from "./DeleteModal";
import ImageShowcase from "./ImageShowcase";

import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";

import dateFormat from "dateformat";

import { socket } from "../socket";
import { UserContext } from "../App";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

function Message({ conversationData, handleConversationData, message }) {
  const { user, token } = useContext(UserContext);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(message.text);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  let correctUser;

  if (conversationData.user1 && conversationData.user1._id === user._id) {
    correctUser = conversationData.user2;
  } else {
    correctUser = conversationData.user1;
  }

  async function editMessage() {
    if (editValue.trim() == "") return;
    try {
      message.text = editValue;
      message.edited = true;
      message.lastEdited = Date.now();
      toggleEditMode();
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/messages/${message._id}`, {
        method: "PUT",
        headers : { "Content-Type": "application/json",
                    "Authorization": token,
        },
        body: JSON.stringify({
          text: editValue,
          messageId: message._id
        })
      });

      const content = await response.json();
      console.log(content);
      let editedMessage = message;
      editedMessage.text = editValue;
      editedMessage.edited = true;
      editedMessage.lastEdited = Date.now();
      socket.emit("edit message", editedMessage);
      socket.emit("notify message", user._id);
      socket.emit("notify message", correctUser._id);
      socket.emit("notify general", correctUser._id);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    setEditValue(e.target.value);
  }

  function handleKeyPress(e) {
    if (e.key == "Escape") {
      toggleEditMode();
    } else if (e.key == "Enter") {
      console.log(editValue);
      e.preventDefault();
      editMessage();
    }
  }

  function toggleDeleteModal() {
    setEditMode(false);
    setShowDeleteModal(!showDeleteModal);
  }

  function toggleEditMode() {
    setEditValue(message.text);
    setEditMode(!editMode);
  }

  async function deleteMessage() {
    try {
      const updatedMessages = conversationData.messages.filter(msg => msg._id !== message._id);
      const updatedConversationData = { ...conversationData, messages: updatedMessages };
      handleConversationData(updatedConversationData);

      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/messages/${message._id}`, {
        method: "DELETE",
        headers : { "Content-Type": "application/json",
                    "Authorization": token,
        },
        body: JSON.stringify({
          conversationId: conversationData._id,
        })
      });

      const content = await response.json();
      console.log(content);
      socket.emit("delete message", message);
      socket.emit("notify message", user._id);
      socket.emit("notify message", correctUser._id);
      socket.emit("notify general", correctUser._id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`flex justify-between pr-6 group hover:bg-[#363636] ${message.sent === false ? "opacity-50" : ""}`}>
      <div className="flex p-1.5 pl-3 pr-3 gap-2 grow">
        <Link to={`/users/${message.user._id}`} className="max-h-10">
          <img src={message.user.image} className="min-w-10 min-h-10 max-w-10 max-h-10 phone:min-w-8 phone:min-h-8 object-cover rounded-full"></img>
        </Link>
        <div className="flex flex-col grow gap-1">
          <div className="flex items-center gap-2 -mb-1">
            <Link to={`/users/${message.user._id}`}>
              <h2 className="text-white font-medium hover:underline whitespace-nowrap underline-offset-1">{message.user.name}</h2>
            </Link>
            <h3 className="text-sm text-neutral-500 whitespace-nowrap">{dateFormat(message.timestamp, "mm/dd/yy h:MM TT")}</h3>
            {message.edited && <p className="text-xs text-neutral-500">(edited)</p>}
          </div>
          {!editMode && <p className="break-all text-neutral-200">{message.text}</p>}
          {editMode &&
            (<div className="flex flex-col gap-1 grow">
              <textarea onChange={handleChange} onKeyDown={handleKeyPress} value={editValue} placeholder="Type to edit message" className="h-10 resize-none grow p-2 rounded-lg bg-neutral-600 text-neutral-200 outline-none"></textarea>
              <div className="flex text-white text-xs">
                <p>escape to</p>
                <p onClick={toggleEditMode} className="text-cyan-500 hover:underline hover:cursor-pointer ml-1 mr-1">cancel</p>
                <p>• enter to</p>
                <p onClick={editMessage} className="text-cyan-500 hover:underline hover:cursor-pointer ml-1 mr-1">save</p>
              </div>
            </div>)
          }
          {message.images && message.images.map((image, index) =>
            <img key={index} src={image} onClick={() => setSelectedImage(image)} className="self-start max-h-[350px] object-scale-down rounded-lg hover:cursor-pointer"></img>
          )}
          {selectedImage && <ImageShowcase image={selectedImage} onClose={() => setSelectedImage(null)}/>}
        </div>
      </div>
      {(user._id == message.user._id) && (!editMode) && (message.sent !== false) &&
        (<div className="flex gap-2 items-center">
          <button onClick={toggleEditMode} className="min-w-5 min-h-5 invert opacity-0 group-hover:opacity-60 phone:opacity-60">
            <img src={editIcon}></img>
          </button>
          <button onClick={toggleDeleteModal} className="min-w-5 min-h-5 opacity-0 group-hover:opacity-80 phone:opacity-80">
            <img src={deleteIcon}></img>
          </button>
        </div>)
      }
      {showDeleteModal && <DeleteModal deleteMessage={deleteMessage} cancel={toggleDeleteModal}/>}
    </div>
  )
}

export default Message;
