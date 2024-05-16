// @ts-nocheck
import robotIcon from "../assets/robot.svg";

import { UserContext } from "../App.tsx";
import { Link } from "react-router-dom";
import { useContext } from "react";

function AIChatMessage({ message }) {
  const { user } = useContext(UserContext);
  const align = message.owner === "user" ? "self-end" : "self-start";
  const color = message.owner === "user" ? "bg-blue-300" : "bg-indigo-400";
  const text = message.text;

  return (
    <div className={`max-w-[70%] ${align} flex items-center gap-2`}>
      {align == "self-start" && <img className="min-w-10 max-w-10 object-cover rounded-full invert opacity-85" src={robotIcon}/>}
      <div className={`${color} rounded-xl p-2 grow`}>
        <p className={`${message.owner === "assistant" ? "font-medium" : ""}`}>{text}</p>
      </div>
      {align == "self-end" && (
        <Link to={`/users/${user._id}`}>
          <img className="min-w-10 max-w-10 object-cover rounded-full" src={user.image}/>
        </Link>
      )}
    </div>
  )
}

export default AIChatMessage;
