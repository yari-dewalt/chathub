// @ts-nocheck
import SidebarConversation from "./SidebarConversation";
import SidebarProfile from "./SidebarProfile";
import NewMessageModal from "./NewMessageModal";

import HomeIcon from "../assets/home.svg";
import SearchIcon from "../assets/search.svg";
import RobotIcon from "../assets/robot.svg";
import AddIcon from "../assets/add.svg";
import ExpandIcon from "../assets/expand.svg";

import { socket } from "../socket";
import { UserContext } from "../App";

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

function SideNav() {
  const { user, token } = useContext(UserContext);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showNewMessageModal, setShowNewMessageModal] = useState<boolean>(false);
  const location = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<string>(location.pathname.split('/')[location.pathname.split('/').length - 1]);
  const [showSideNav, setShowSideNav] = useState<boolean>(false);

  function toggleShowNewMessageModal() {
    setShowNewMessageModal(!showNewMessageModal);
  }

  function toggleShowSideNav() {
    setShowSideNav(!showSideNav);
  }

  function handleConversations(newConversations: Conversation[]) {
    setConversations(newConversations);
  }

  useEffect(() => {
    setSelectedConversationId(location.pathname.split('/')[location.pathname.split('/').length - 1]);
  }, [location])

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/${user._id}/conversations`, {
          method: "GET",
          headers : { "Content-Type": "application/json",
                      "Authorization": token
          },
        });

        const content: Conversation[] = await response.json();
        console.log(content);
        setConversations(content);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }

    fetchConversations();

    socket.on("notify message", fetchConversations);

    return () => {
      socket.off("notify message", fetchConversations);
    }
  }, []);

  return (
    <>
      <nav className="flex flex-col phone:hidden justify-between min-w-72 max-w-72 bg-neutral-800">
        <div className="p-4 flex flex-col text-gray-400 grow">
          <div className="flex flex-col gap-1 mb-3">
            <Link to="/" className={`h-11 p-2 flex gap-4 items-center rounded group hover:cursor-pointer ${selectedConversationId !== "" ? "hover:bg-neutral-700" : ""} ${selectedConversationId == "" ? "bg-neutral-600" : ""}`}>
              <img src={HomeIcon} className={`w-7 invert group-hover:opacity-85 ${selectedConversationId == "" ? "opacity-85" : "opacity-50"}`}></img>
              <h2 className={`group-hover:text-white ${selectedConversationId == "" ? "text-white" : ""}`}>Home</h2>
            </Link>
            <Link to="/search" className={`h-11 p-2 flex gap-4 items-center rounded group hover:cursor-pointer ${selectedConversationId !== "search" ? "hover:bg-neutral-700" : ""} ${selectedConversationId == "search" ? "bg-neutral-600" : ""}`}>
              <img src={SearchIcon} className={`w-7 invert group-hover:opacity-85 ${selectedConversationId == "search" ? "opacity-85" : "opacity-50"}`}></img>
              <h2 className={`group-hover:text-white ${selectedConversationId == "search" ? "text-white" : ""}`}>Search</h2>
            </Link>
            <Link to="/chat" className={`h-11 p-2 flex gap-4 items-center rounded group hover:cursor-pointer ${selectedConversationId !== "chat" ? "hover:bg-neutral-700" : ""} ${selectedConversationId == "chat" ? "bg-neutral-600" : ""}`}>
              <img src={RobotIcon} className={`w-7 invert group-hover:opacity-85 ${selectedConversationId == "chat" ? "opacity-85" : "opacity-50"}`}></img>
              <h2 className={`group-hover:text-white ${selectedConversationId == "chat" ? "text-white" : ""}`}>AI Chat</h2>
            </Link>
          </div>
          <div className="flex justify-between items-center p-2 group">
            <h2 className="text-xs group-hover:text-white font-medium">DIRECT MESSAGES</h2>
            <button onClick={toggleShowNewMessageModal}>
              <img src={AddIcon} className="w-4 invert opacity-50 group-hover:hover:opacity-85"></img>
            </button>
          </div>
          <div className="flex flex-col gap-1 grow overflow-y-scroll">
            {conversations.map((conversation) => 
            (<SidebarConversation key={conversation._id} conversation={conversation} selected={selectedConversationId === conversation._id} conversations={conversations} handleConversations={handleConversations}/>)
            )}
          </div>
        </div>
        <SidebarProfile user={user}/>
      </nav>
      {showNewMessageModal && <NewMessageModal cancel={toggleShowNewMessageModal}/>}
      {!showSideNav &&
        (<button onClick={toggleShowSideNav} className="z-10 min-w-6 min-h-6 absolute top-4 left-4 hidden phone:block">
          <img src={ExpandIcon} alt="expand" className="invert opacity-50 hover:opacity-85 min-w-11"></img>
        </button>)
      }
      {showSideNav &&
      (<div onClick={toggleShowSideNav} className="z-10 absolute h-screen w-screen bg-black bg-opacity-50">
        <nav className="flex flex-col justify-between min-w-72 max-w-72 h-screen bg-neutral-800">
          <div className="p-4 flex flex-col text-gray-400 grow">
            <div className="flex flex-col gap-1 mb-3">
              <Link to="/" className={`h-11 p-2 flex gap-4 items-center rounded group hover:cursor-pointer ${selectedConversationId !== "" ? "hover:bg-neutral-700" : ""} ${selectedConversationId == "" ? "bg-neutral-600" : ""}`}>
                <img src={HomeIcon} className={`w-7 invert group-hover:opacity-85 ${selectedConversationId == "" ? "opacity-85" : "opacity-50"}`}></img>
                <h2 className={`group-hover:text-white ${selectedConversationId == "" ? "text-white" : ""}`}>Home</h2>
              </Link>
              <Link to="/search" className={`h-11 p-2 flex gap-4 items-center rounded group hover:cursor-pointer ${selectedConversationId !== "search" ? "hover:bg-neutral-700" : ""} ${selectedConversationId == "search" ? "bg-neutral-600" : ""}`}>
                <img src={SearchIcon} className={`w-7 invert group-hover:opacity-85 ${selectedConversationId == "search" ? "opacity-85" : "opacity-50"}`}></img>
                <h2 className={`group-hover:text-white ${selectedConversationId == "search" ? "text-white" : ""}`}>Search</h2>
              </Link>
              <Link to="/chat" className={`h-11 p-2 flex gap-4 items-center rounded group hover:cursor-pointer ${selectedConversationId !== "chat" ? "hover:bg-neutral-700" : ""} ${selectedConversationId == "chat" ? "bg-neutral-600" : ""}`}>
                <img src={RobotIcon} className={`w-7 invert group-hover:opacity-85 ${selectedConversationId == "chat" ? "opacity-85" : "opacity-50"}`}></img>
                <h2 className={`group-hover:text-white ${selectedConversationId == "chat" ? "text-white" : ""}`}>AI Chat</h2>
              </Link>
            </div>
            <div className="flex justify-between items-center p-2 group">
              <h2 className="text-xs group-hover:text-white font-medium">DIRECT MESSAGES</h2>
              <button onClick={toggleShowNewMessageModal}>
                <img src={AddIcon} className="w-4 invert opacity-50 group-hover:hover:opacity-85"></img>
              </button>
            </div>
            <div className="flex flex-col gap-1 grow overflow-y-scroll">
              {conversations.map((conversation) => 
              (<SidebarConversation key={conversation._id} conversation={conversation} selected={selectedConversationId === conversation._id} conversations={conversations} handleConversations={handleConversations}/>)
              )}
            </div>
          </div>
          <SidebarProfile user={user}/>
        </nav>
      </div>)
      }
    </>
  )
}

export default SideNav;
