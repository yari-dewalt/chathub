// @ts-nocheck
import NewMessageIcon from "../assets/new_message.svg";
import FriendRequestIcon from "../assets/friend_request.svg";
import CloseIcon from "../assets/close.svg";
import GeneralIcon from "../assets/general.svg";

import dateFormat from "dateformat";

import { socket } from "../socket";
import { UserContext } from "../App";

import { useContext } from "react";
import { Link } from "react-router-dom";

function Notification({ notification, notifications, handleNotifications }) {
  const { user, token } = useContext(UserContext);

  let icon;
  switch (notification.type) {
    case "message":
      icon = NewMessageIcon;
      break;
    case "friendRequest":
      icon = FriendRequestIcon;
      break;
    case "general":
      icon = GeneralIcon;
      break;
    default:
      icon = GeneralIcon;
      break;
  }

  async function deleteNotification(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const newNotifications = notifications.filter(function(item) {
        return item !== notification
      });
      handleNotifications(newNotifications);

      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/notifications/${notification._id}`, {
        method: "DELETE",
        body: JSON.stringify({ receiverId: user._id }),
        headers : { "Content-Type": "application/json",
                    "Authorization": token
        },
      });

      const content = await response.json();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }

  async function acceptFriendRequest() {
    try {
      const newNotifications = notifications.filter(function(item) {
        return item !== notification
      });
      handleNotifications(newNotifications);

      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/notifications/friendRequest/accept`, {
        method: "POST",
        body: JSON.stringify({
          senderId: notification.user,
          receiverId: user._id,
          notificationId: notification._id
        }),
        headers : { "Content-Type": "application/json",
                    "Authorization": token
        },
      });

      const content = await response.json();
      socket.emit("notify general", notification.user._id);
      socket.emit("notify general", user._id); // To refresh our friends list on home.
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  }

  async function declineFriendRequest() {
    try {
      const newNotifications = notifications.filter(function(item) {
        return item !== notification
      });
      handleNotifications(newNotifications);

      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/notifications/friendRequest/decline`, {
        method: "POST",
        body: JSON.stringify({
          senderId: notification.user,
          receiverId: user._id,
          notificationId: notification._id
        }),
        headers : { "Content-Type": "application/json",
                    "Authorization": token
        },
      });

      const content = await response.json();
      socket.emit("notify general", notification.user._id);
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  }

  return (
    <>
      {notification.type == "message" && notification.conversationId &&
      (<Link to={`conversations/${notification.conversationId}`} className="flex gap-2 items-center justify-between p-3 pr-1 w-full rounded hover:cursor-pointer hover:bg-neutral-700 group">
        <div className="flex gap-2 items-center">
          <img src={icon} alt={notification.type} className="self-start mt-2 invert opacity-50 w-7 group-hover:opacity-85"></img>
          <div className="flex flex-col">
            <h2 className="-mb-1 text-gray-400 font-medium group-hover:text-white">{notification.user.name}</h2>
            <p className="text-neutral-400 group-hover:text-gray-200">{notification.text || "Sent an image."}</p>
            <h3 className="text-xs text-neutral-500 group-hover:text-gray-300">{dateFormat(notification.timestamp, "mm/dd/yy h:MM TT")}</h3>
            {notification.type == "friendRequest" &&
              (<div className="flex justify-center gap-2 mt-2">
                <button onClick={acceptFriendRequest} className="p-1 text-neutral-700 hover:text-black bg-green-400 rounded border-2 border-transparent hover:border-white transition-colors duration-200">Accept</button>
                <button onClick={declineFriendRequest} className="p-1 text-neutral-700 hover:text-black bg-red-400 rounded border-2 border-transparent hover:border-white transition-colors duration-200">Decline</button>
              </div>)
            }
          </div>
        </div>
        <button onClick={deleteNotification} className="min-w-5 w-5">
          <img src={CloseIcon} className="min-w-5 w-5 invert opacity-0 group-hover:opacity-50 group-hover:hover:opacity-85"></img>
        </button>
      </Link>)
      }
      {notification.type != "message" && !notification.conversationId &&
      (<div className="flex gap-2 items-center justify-between p-3 pr-1 w-full rounded hover:cursor-pointer hover:bg-neutral-700 group">
        <div className="flex gap-2 items-center">
          <img src={icon} alt={notification.type} className="self-start mt-2 invert opacity-50 w-7 group-hover:opacity-85"></img>
          <div className="flex flex-col">
            <h2 className="-mb-1 text-gray-400 font-medium group-hover:text-white">{notification.user.name}</h2>
            <p className="text-neutral-400 group-hover:text-gray-200">{notification.text}</p>
            <h3 className="text-xs text-neutral-500 group-hover:text-gray-300">{dateFormat(notification.timestamp, "mm/dd/yy h:MM TT")}</h3>
            {notification.type == "friendRequest" &&
              (<div className="flex justify-center gap-2 mt-2">
                <button onClick={acceptFriendRequest} className="p-1 text-neutral-700 hover:text-black bg-green-400 rounded border-2 border-transparent hover:border-white transition-colors duration-200">Accept</button>
                <button onClick={declineFriendRequest} className="p-1 text-neutral-700 hover:text-black bg-red-400 rounded border-2 border-transparent hover:border-white transition-colors duration-200">Decline</button>
              </div>)
            }
          </div>
        </div>
        <button onClick={deleteNotification} className="min-w-5 w-5">
          <img src={CloseIcon} className="min-w-5 w-5 invert opacity-0 group-hover:opacity-50 group-hover:hover:opacity-85"></img>
        </button>
      </div>)
      }
    </>
  )
}

export default Notification;
