// @ts-nocheck
import { UserType, Message, Conversation, Notification } from "../types";

import SideNav from "./components/SideNav";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import DirectMessage from "./pages/DirectMessage";
import User from "./pages/User";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Error from "./pages/Error";

import { socket } from "./socket";
import { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";


export const UserContext = createContext<{
  user: User | null,
  token: string,
  setUser: Function
}>({
  user: null,
  token: "",
  setUser: () => {}
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  if (!loaded && !user && !token && !window.location.pathname.includes("login")) {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setToken(localStorage.getItem("token") || "");
    setLoaded(true);
  }

  useEffect(() => {
    socket.connect();
    if (user !== null) {
      socket.emit("assign id", user._id);
    }

    return () => {
      socket.disconnect();
    }
  }, []);

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
        setUser(content);
        localStorage.setItem("user", JSON.stringify(content));
      } catch (error) {
      }
    }

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      <div className="flex min-h-screen bg-neutral-700">
        <Router>
          {user && <SideNav/>}
          <Routes>
            <Route path="/" element={user ? <Home/> : <Navigate to="/login"/>}/>
            <Route path="/search" element={user ? <Search/> : <Navigate to="/login"/>}/>
            <Route path="/chat" element={user ? <Chat/> : <Navigate to="/login"/>}/>
            <Route path="/conversations/:conversationId" element={user ? <DirectMessage/> : <Navigate to="/login"/>}/>
            <Route path="/users/:userId" element={user ? <User/> : <Navigate to="/login"/>}/>
            <Route path="/login" element={!user ? <LogIn/> : <Navigate to="/"/>}/>
            <Route path="/signup" element={!user ? <SignUp/> : <Navigate to="/"/>}/>
            <Route path="*" element={<Error/>}/>
          </Routes>
        </Router>
      </div>
    </UserContext.Provider>
  )
}

export default App;
