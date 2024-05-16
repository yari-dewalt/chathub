// @ts-nocheck
import GitHubIcon from "../assets/github.svg";

import { UserContext } from "../App";
import FriendsArea from "../components/FriendsArea";
import NotificationsArea from "../components/NotificationsArea";
import NotificationsButton from "../components/NotificationsButton";

import { socket } from "../socket";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";


function Home() {
  const { user, setUser, token } = useContext(UserContext);
  const [userData, setUserData] = useState<User>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/${user._id}`, {
          method: "GET",
          headers : { "Content-Type": "application/json",
                      "Authorization": token
          },
        });

        const content: User = await response.json();
        console.log(content);
        setUserData(content);
        setUser(content);
        localStorage.setItem("user", JSON.stringify(content));
        setNotifications(content.notifications);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
      setLoading(false);
    }

    fetchUserData();

    socket.on("notify general", fetchUserData);

    return () => {
      socket.off("notify general", fetchUserData);
    }
  }, []);

  function handleNotifications(newNotifications: Notification[]) {
    setNotifications(newNotifications);
  }

  return (
    <div className="grow flex relative justify-center">
      <div className="grow flex flex-col items-center justify-between p-4">
        <div className="flex-col gap-2">
          <FriendsArea friends={userData.friends || []}/>
          {userData.friends && userData.friends.length == 0 &&
            (<div className="text-white flex flex-col items-center">
              <p>You currently have no friends :(</p>
              <div className="flex gap-1">
                <Link to="/search" className="font-bold text-blue-500">Search</Link>
                <p>to find more!</p>
              </div>
            </div>)
          }
        </div>
        <div className="flex gap-2 items-center">
          <Link to="https://github.com/yari-dewalt">
            <img alt="github icon" src={GitHubIcon} className="min-w-7 w-7"></img>
          </Link>
          <Link to="https://github.com/yari-dewalt" className="text-white hover:underline">yari-dewalt</Link>
        </div>
      </div>
      {!showNotifications && 
      (<div className="absolute top-0 right-0 p-4">
        <NotificationsButton onClick={() => setShowNotifications(true)} notifications={notifications}/>
      </div>)
      }
      {showNotifications &&
        <div className="absolute flex top-0 right-0 min-h-screen max-h-screen">
          <NotificationsArea onClick={() => setShowNotifications(false)} notifications={notifications} handleNotifications={handleNotifications}/>
        </div>
      }
    </div>
  )
}

export default Home;
