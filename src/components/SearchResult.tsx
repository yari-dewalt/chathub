// @ts-nocheck
import { UserContext } from "../App";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

function SearchResult({ resultUser, messageSearch, handleSelectedUser, isSelected }) {
  const { user, token } = useContext(UserContext);
  const isFriend = user.friends.some((friend) => friend._id === resultUser._id);
  const [hasSentRequest, setHasSentRequest] = useState<boolean>(false);

  useEffect(() => {
    if (resultUser.notifications) {
      setHasSentRequest(
        resultUser.notifications.some(
          (notification) =>
            notification.type === "friendRequest" &&
            notification.user === user._id &&
            notification.text.includes("sent")
        )
      );
    }
  }, []);

  async function sendFriendRequest(e) {
    e.preventDefault();
    e.stopPropagation();
    setHasSentRequest(true);
    try {
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/notifications/friendRequest`, {
        method: "POST",
        body: JSON.stringify({
          senderId: user._id,
          receiverId: resultUser._id
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        }
      });

      const content = await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelFriendRequest(e) {
    e.preventDefault();
    e.stopPropagation();
    setHasSentRequest(false);
    try {
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/notifications/friendRequest/cancel`, {
        method: "POST",
        body: JSON.stringify({
          senderId: user._id,
          receiverId: resultUser._id
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        }
      });

      const content = await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  function selectUser() {
    handleSelectedUser(resultUser);
  }

  return (
    <>
      {!messageSearch ? (
        <Link to={`/users/${resultUser._id}`} className="flex justify-between p-2 w-full h-11 items-center rounded hover:cursor-pointer hover:bg-neutral-700 group">
          <div className="flex grow items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img src={resultUser.image} className="phone:min-w-6 phone:min-h-6 phone:max-w-6 phone:max-h-6 min-w-9 min-h-9 max-w-9 max-h-9 object-cover rounded-full"></img>
              <div className="flex items-center gap-1 whitespace-nowrap max-w-[80%] overflow-x-hidden">
                <h2 className="phone:text-xs text-gray-300 group-hover:text-white phone:text-white">{resultUser.name}</h2>
                <h3 className="text-gray-400 text-xs">{`@${resultUser.username}`}</h3>
              </div>
            </div>
          {!isFriend && !hasSentRequest && (
            <button onClick={sendFriendRequest} className="max-h-6 whitespace-nowrap p-1 text-xs text-gray-300 bg-green-700 rounded hover:bg-green-600 hover:text-white phone:bg-green-600 phone:text-white">Send Friend Request</button>
          )}
          {!isFriend && hasSentRequest && (
            <button onClick={cancelFriendRequest} className="p-1 text-xs text-gray-300 bg-red-700 rounded hover:bg-red-600 hover:text-white phone:bg-red-600 phone:text-white">Cancel Friend Request</button>
          )}
          </div>
        </Link>
      ) : (
        <div onClick={selectUser} className="flex justify-between p-2 w-full h-11 items-center rounded hover:cursor-pointer hover:bg-neutral-700 group">
          <div className="flex items-center gap-2">
            <img src={resultUser.image} className="w-9 h-9 object-cover rounded-full"></img>
            <div className="flex items-center gap-1">
              <h2 className="text-gray-300 group-hover:text-white phone:text-white">{resultUser.name}</h2>
              <h3 className="text-gray-400 text-xs">{`@${resultUser.username}`}</h3>
            </div>
          </div>
          <div className={`min-w-6 min-h-6 flex justify-center items-center border-2 border-black border-opacity-15 rounded-full`}>
              <div className={`w-5 h-5 rounded-full ${isSelected ? "bg-indigo-500" : ""}`}></div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchResult;
