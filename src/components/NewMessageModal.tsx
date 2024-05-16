// @ts-nocheck
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import CloseIcon from "../assets/close.svg";

import { socket } from "../socket";
import { UserContext } from "../App";

import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

function NewMessageModal({ cancel }) {
  const { user, token } = useContext(UserContext);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState<User>({});
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setInputValue(value);
  };

  async function sendMessage() {
    if (!selectedUser._id)
      return;

    try {
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/${selectedUser._id}/startConversation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json",
                    "Authorization": token,
      },
        body: JSON.stringify({ senderId: user._id })
      });

      if (!response.ok) {
        throw new Error("Failed to start conversation");
      }

      const content = await response.json();

      navigate(`/conversations/${content._id}`);
      socket.emit("notify message", user._id);
      cancel();
    } catch (error) {
      console.log(error);
    }
  }

  function handleSearchResults(newResults) {
    setSearchResults(newResults);
  }

  function handleSelectedUser(newUser) {
    setSelectedUser(newUser);
  }

  return (
    <div className="absolute top-0 z-10 left-0 flex justify-center items-center min-h-screen w-screen bg-opacity-30 bg-black">
      <div className="shadow-xl phone:max-w-96 relative z-20 flex flex-col p-6 gap-4 rounded items-center border-2 border-neutral-800 bg-neutral-700 pointer-events-auto">
        <img onClick={cancel} alt="close" src={CloseIcon} className="absolute min-w-5 top-4 right-4 invert opacity-50 hover:opacity-85 hover:cursor-pointer"></img>
        <h2 className="text-xl text-white font-bold">Select user to message</h2>
        <div className="flex flex-col phone:max-w-80">
          <div className="flex flex-col items-center bg-neutral-800 rounded-tl rounded-tr">
            <SearchBar handleSearchResults={handleSearchResults}/>
            <div className="w-3/4 h-0.5 bg-black opacity-15">
            </div>
          </div>
          {searchResults.length > 0 &&
            (<div className="flex flex-col gap-2 w-96 max-h-72 phone:max-w-80 overflow-y-scroll p-4 rounded-br rounded-bl bg-neutral-800">
              {searchResults.map((result) => (
                <SearchResult key={result._id} resultUser={result} messageSearch={true} handleSelectedUser={handleSelectedUser} isSelected={selectedUser._id === result._id}/>
              ))}
            </div>)
          }
          {user.friends.length > 0 && searchResults.length == 0 &&
            (<div className="flex flex-col gap-2 w-96 max-h-72 phone:max-w-80 overflow-y-scroll p-4 rounded-br rounded-bl bg-neutral-800">
              {user.friends.map((friend) => (
                <SearchResult key={friend._id} resultUser={friend} messageSearch={true} handleSelectedUser={handleSelectedUser} isSelected={selectedUser._id === friend._id}/>
              ))}
            </div>)
          }
        </div>
        <div className="flex w-full gap-6">
          <button onClick={sendMessage} className={`grow text-neutral-300 hover:text-white font-bold p-2 rounded border-2 border-transparent hover:border-white transition-color duration-200 ${selectedUser._id ? "bg-indigo-500" : "bg-indigo-400"}`}>Create DM</button>
        </div>
      </div>
    </div>
  )
}

export default NewMessageModal;
