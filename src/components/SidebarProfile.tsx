// @ts-nocheck
import LogOutIcon from "../assets/logout.svg";

import { useState } from "react";
import { Link } from "react-router-dom";

function SidebarProfile({ user }) {
  function logOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  }

  return (
    <div className="relative flex w-full p-2 gap-3 bg-neutral-900 items-center justify-between">
      <Link to={`/users/${user._id}`}className="p-1 flex gap-2 grow items-center rounded hover:cursor-pointer hover:bg-neutral-700">
        <div className="relative">
          <img src={user.image} className="min-w-9 min-h-9 max-w-9 max-h-9 object-cover rounded-full"></img>
          <div className="absolute bottom-0 right-0 bg-neutral-900 rounded-full w-4 h-4 p-1 flex items-center justify-center">
            <div className="bg-green-500 min-w-3 min-h-3 rounded-full"></div>
          </div>
        </div>
        <div className="flex flex-col max-w-44">
          <h3 className="text-white whitespace-nowrap text-ellipsis overflow-hidden">{user.name}</h3>
          <p className="text-gray-400 text-sm whitespace-nowrap text-ellipsis overflow-hidden">{user.username}</p>
        </div>
      </Link>
      <div onClick={logOut} className="min-w-9 rounded p-2 hover:cursor-pointer hover:bg-neutral-700">
        <img alt="logout" src={LogOutIcon} className="opacity-100"></img>
      </div>
    </div>
  )
}

export default SidebarProfile;
