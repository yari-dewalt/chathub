// @ts-nocheck
import FriendCircle from "../components/FriendCircle";
import FriendsArea from "../components/FriendsArea";
import EditIcon from "../assets/edit.svg";

import { socket } from "../socket";
import { UserContext } from "../App";

import { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function User() {
  const { user, token, setUser } = useContext(UserContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [hasSentRequest, setHasSentRequest] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [aboutMeText, setAboutMeText] = useState<string>(userData.aboutme);
  const [messageText, setMessageText] = useState<string>("");
  const inputFile = useRef(null);

  useEffect(() => {
    if (userData.notifications) {
      setHasSentRequest(
        userData.notifications.some(
            (notification) =>
              notification.type === "friendRequest" && notification.user._id === user._id && notification.text.includes("sent")
          ))
    }

    if (userData) {
      setIsFriend(user.friends.some((friend) => friend._id === userData._id));
    }
  }, [userData.notifications]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/${userId}`, {
          method: "GET",
          headers : { "Content-Type": "application/json",
                      "Authorization": token
          },
        });

        const content: User = await response.json();
        setUserData(content);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    }

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    setAboutMeText(userData.aboutme);
  }, [userData])

  async function sendFriendRequest(e) {
    e.preventDefault();
    e.stopPropagation();
    setHasSentRequest(true);
    try {
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/notifications/friendRequest`, {
        method: "POST",
        body: JSON.stringify({
          senderId: user._id,
          receiverId: userData._id
        }),
        headers : { "Content-Type": "application/json",
                    "Authorization": token,
        }
      });

      const content = await response.json();
      socket.emit("notify general", userData._id);
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
          receiverId: userData._id
        }),
        headers : { "Content-Type": "application/json",
                    "Authorization": token,
        }
      });

      const content = await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  async function removeFriend() {
    try {
      setIsFriend(false);
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/friends/remove`, {
        method: "POST",
        body: JSON.stringify({
          userId: user._id,
          friendId: userData._id
        }),
        headers : { "Content-Type": "application/json",
                    "Authorization": token,
        }
      });
      
      const content = await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  async function updateAboutMe() {
    try {
      toggleIsEditing();
      setAboutMeText(aboutMeText);
      userData.aboutme = aboutMeText;
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/aboutme`, {
        method: "PUT",
        body: JSON.stringify({
          userId: userData._id,
          text: aboutMeText
        }),
        headers : { "Content-Type": "application/json",
                    "Authorization": token,
        }
      });

      const content = await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  async function updateImage(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("userImage", file);
    setUser(prevUser => ({ ...prevUser, image: URL.createObjectURL(file) }));
    userData.image = URL.createObjectURL(file);

    try {
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/${user._id}/image`, {
        method: "PATCH",
        headers : { "Authorization": token },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Updating image failed");
      }

      const content = await response;
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage() {
    try {
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/${userId}/startConversation`,
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
    } catch (error) {
      console.log(error);
    }
  }

  function toggleIsEditing() {
    if (isEditing)
      setAboutMeText(userData.aboutme);
    setIsEditing(!isEditing);
  }

  function handleAboutMeChange(e) {
    setAboutMeText(e.target.value);
  }

  function handleMessageChange(e) {
    setMessageText(e.target.value);
  }

  function selectFile() {
    inputFile.current.click();
  }

  return (
    <div className="grow flex flex-col items-center gap-8 p-10">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <FriendCircle user={userData}/>
          {user._id === userData._id &&
            (<div onClick={selectFile} className="group hover:bg-neutral-400 hover:cursor-pointer flex justify-center items-center min-w-10 min-h-10 bg-neutral-500 rounded-full absolute bottom-10 right-2">
              <img alt="edit" src={EditIcon} className="invert opacity-50 group-hover:opacity-85"></img>
              <input onChange={updateImage} type="file" accept=".png, .jpg, .jpeg, .webp" id="file" ref={inputFile} className="hidden"></input>
            </div>)
          }
        </div>
        <h2 className="text-lg text-gray-400 -mt-3">{userData.username && `@${userData.username}`}</h2>
        {user._id !== userData._id && userData.aboutme && <p className="text-white max-w-52 break-words text-center">{aboutMeText}</p>}
        {user._id === userData._id &&
          (<div className="flex gap-2">
            {!userData.aboutme && !isEditing && <p className="text-gray-400">Edit About Me</p>}
            {userData.aboutme && !isEditing && <p className="text-white max-w-52 break-words">{aboutMeText}</p>}
            {isEditing &&
              (<div className="flex flex-col gap-2">
                <textarea onChange={handleAboutMeChange} value={aboutMeText} placeholder="Edit About Me" className="text-white outline-none rounded p-2 bg-neutral-600 resize-none"></textarea>
                <div className="flex gap-1 self-end">
                  <button className="w-16 rounded p-1 bg-green-600 hover:bg-green-500 text-neutral-300 hover:text-white phone:bg-green-500 phone:text-white" onClick={updateAboutMe}>Save</button>
                  <button className="w-16 rounded p-1 bg-red-600 hover:bg-red-500 text-neutral-300 hover:text-white phone:bg-red-500 phone:text-white" onClick={toggleIsEditing}>Cancel</button>
                </div>
              </div>)
            }
            {!isEditing && <img onClick={toggleIsEditing} alt="edit" src={EditIcon} className="invert opacity-30 hover:opacity-85 hover:cursor-pointer"></img>}
          </div>)
        }
        {!isFriend && !hasSentRequest && userData.name && (userData._id !== user._id) &&
          <button onClick={sendFriendRequest} className="p-1 w-44 text-base text-gray-300 bg-green-700 rounded hover:bg-green-600 hover:text-white phone:bg-green-600 phone:text-white">Send Friend Request</button>
        }
        {!isFriend && hasSentRequest &&
          <button onClick={cancelFriendRequest} className="p-1 w-44 text-base text-gray-300 bg-red-700 rounded hover:bg-red-600 hover:text-white phone:bg-red-600 phone:text-white">Cancel Friend Request</button>
        }
        {isFriend &&
          <button onClick={removeFriend} className="p-1 w-44 text-base text-gray-300 bg-neutral-500 rounded hover:bg-red-400 hover:text-white phone:bg-red-500 phone:text-white">Remove as Friend</button>
        }
        {userData._id && user._id !== userData._id && <button onClick={sendMessage} className="p-1 w-44 text-base text-gray-300 bg-indigo-400 rounded hover:bg-indigo-500 hover:text-white phone:bg-indigo-500 phone:text-white">Send Message</button>}
        </div>
      <FriendsArea friends={userData.friends || []}/>
      {user._id !== userData._id && userData.friends && userData.friends.length == 0 &&
        (<div className="flex flex-col">
          <p className="text-neutral-400">This user has no friends currently :(</p>
          <p className="text-neutral-400">Maybe send them a friend request!</p>
        </div>)
      }
      {user._id === userData._id && user.friends && user.friends.length == 0 &&
        (<div className="text-white flex flex-col items-center">
          <p>You currently have no friends :(</p>
          <div className="flex gap-1">
            <Link to="/search" className="font-bold text-blue-500">Search</Link>
            <p>to find more!</p>
          </div>
        </div>)
      }
    </div>
  )
}

export default User;
