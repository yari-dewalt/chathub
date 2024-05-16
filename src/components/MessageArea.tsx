// @ts-nocheck
import ImagesArea from "./ImagesArea.tsx";

import addIcon from "../assets/add.svg";

import dateFormat from "dateformat";

import { socket } from "../socket";
import { UserContext } from "../App";

import { useState, useContext, useRef, useEffect } from "react";

function MessageArea({ conversationData, messages, handleMessages }) {
  conversationData.users = [conversationData.user1, conversationData.user2];
  const { user, token } = useContext(UserContext);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [imagesToSend, setImagesToSend] = useState([]);
  const [showImagesArea, setShowImagesArea] = useState<boolean>(false);
  const [files, setFiles] = useState<File>([]);
  let correctUser;
  const inputFile = useRef(null);

  if (conversationData.user1 && conversationData.user1._id === user._id) {
    correctUser = conversationData.user2;
  } else {
    correctUser = conversationData.user1;
  }

  useEffect(() => {
    socket.on("typing", handleTyping);
    socket.on("stop typing", handleStopTyping);
    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
    }
  }, [correctUser, inputValue]);

  function handleStopTyping(userId) {
    if (userId == correctUser._id) {
      setIsTyping(false);
    }
  }

  function handleTyping(userId) {
    if (userId == correctUser._id) {
      setIsTyping(true);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value.trim().length > 0) {
      socket.emit("typing", user._id);
    } else if (value.trim().length === 0) {
      socket.emit("stop typing", user._id);
    }
    setInputValue(value);
  };

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (inputValue.trim() === "" && imagesToSend.length == 0)
      return;

    const formData = new FormData();
    formData.append("senderId", user._id);
    formData.append("receiverId", correctUser._id);
    formData.append("text", inputValue);
    for (const file of files) {
      formData.append("messageImages", file);
    }

    const message = {
      "user": user,
      "images": imagesToSend.map(image => image.src),
      "text": inputValue,
      "timestamp": dateFormat(Date.now(), "mm/dd/yy h:MM TT"),
      "sent": false
    }
    const updatedMessages = [message, ...messages];
    handleMessages(updatedMessages);

    setInputValue("");
    setFiles([]);
    setImagesToSend([]);
    setShowImagesArea(false);

    try {
      const response = await fetch("https://chathub-backend-v3lv.onrender.com/messages", {
        method: "POST",
        headers : {
                    "Authorization": token,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Sending message failed");
      }

      const content = await response.json();
      content.sent = true;
      const updatedMessages = [content, ...messages.slice(0)];
      handleMessages(updatedMessages);
      socket.emit("stop typing", user._id);
      socket.emit("message", content);
      socket.emit("notify message", user._id); // Send signal to ourselves too.
      socket.emit("notify message", correctUser._id);
      socket.emit("notify general", correctUser._id);
    } catch (error) {
      console.log(error);
    }
  };

  function addImage(e) {
    const file = e.target.files[0];
    let image = {
                  "src": URL.createObjectURL(file),
                  "name": file.name
                };
    setImagesToSend(prevImages => [...prevImages, image]);
    setFiles(prevFiles => [...prevFiles, file]);
    setShowImagesArea(true);
  }

  function removeImage(image) {
    let index;
    setImagesToSend(prevImages => {
      index = prevImages.findIndex(img => img == image);
      const updatedImages = [...prevImages.slice(0, index), ...prevImages.slice(index + 1)];
      return updatedImages;
    });
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles.slice(0, index), ...prevFiles.slice(index + 1)];
      return updatedFiles;
    });
  }

  useEffect(() => {
    if (imagesToSend.length == 0) {
      setShowImagesArea(false);
    }
  }, [imagesToSend])

  return (
    <div className="p-5">
      <div className="flex flex-col gap-3 p-3 rounded-lg bg-neutral-600">
        {showImagesArea && (
          <>
            <ImagesArea images={imagesToSend} removeImage={removeImage}/>
            <div className="h-[1px] min-w-full bg-neutral-400"></div>
          </>
        )}
        <div className="flex min-w-full items-center gap-3 pl-1 pr-1">
          <button onClick={() => inputFile.current.click()} title="Upload image" className="p-1 rounded-full bg-neutral-400 hover:bg-neutral-200 w-6">
            <img src={addIcon} className="opacity-75"></img>
            <input onChange={addImage} type="file" accept=".png, .jpg, .jpeg" id="file" ref={inputFile} className="hidden"></input>
          </button>
          <form onSubmit={sendMessage} className="grow flex">
            <input value={inputValue} onChange={handleChange} placeholder={`Message ${correctUser ? correctUser.name : ""}`} className="grow text-neutral-200 bg-transparent outline-none"></input>
          </form>
        </div>
      </div>
      <p className={`-mb-4 mt-0.5 text-xs text-white ${!isTyping ? "opacity-0" : ""}`}>{isTyping ? `${correctUser.name} is typing...` : "is typing..."}</p>
    </div>
  )
}

export default MessageArea;
