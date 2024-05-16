// @ts-nocheck
import CloseIcon from "../assets/close.svg";

import { UserContext } from "../App";

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

function SidebarConversation({ conversation, selected, conversations, handleConversations }) {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();
  let correctUser;
  if (conversation.user1._id === user._id) {
    correctUser = conversation.user2;
  } else {
    correctUser = conversation.user1;
  }

  async function closeConversation(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const newConversations = conversations.filter(function (item) {
        return item !== conversation;
      });
      handleConversations(newConversations);

      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/conversations/remove`, {
        method: "POST",
        headers : { "Content-Type": "application/json",
                    "Authorization": token,
        },
        body: JSON.stringify({
          userId: user._id,
          conversationId: conversation._id,
        })
      });

      const content = await response.json();

      if (window.location.pathname.includes(conversation._id))
        navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Link to={`/conversations/${conversation._id}`}>
      <div className={`flex justify-between p-2 w-full h-11 items-center rounded hover:cursor-pointer ${selected ? "bg-neutral-600" : "hover:bg-neutral-700"} group`}>
        <div className="flex items-center gap-2 min-w-[164px] max-w-[164px]">
          <img src={correctUser.image} className="min-w-9 min-h-9 max-w-9 max-h-9 object-cover rounded-full"></img>
          <div className="flex flex-col p-1">
            <h3 className={`text-gray-400 max-w-44 whitespace-nowrap text-ellipsis overflow-hidden ${selected ? "text-white" : "group-hover:text-white"}`}>{correctUser.name}</h3>
            <p className={`text-sm -mt-1 max-w-44 whitespace-nowrap text-ellipsis overflow-hidden ${selected ? "text-white" : "group-hover:text-white"}`}>{conversation.lastMessage && (conversation.lastMessage.text || "Sent an image.")}</p>
          </div>
        </div>
        <img onClick={closeConversation} src={CloseIcon} className="min-w-4 max-w-4 invert opacity-0 group-hover:hover:opacity-85 group-hover:opacity-50"></img>
      </div>
    </Link>
  )
}

export default SidebarConversation;
