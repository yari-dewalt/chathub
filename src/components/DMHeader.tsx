// @ts-nocheck
import { Link } from "react-router-dom";

function DMHeader({ user }) {
  return (
    <div className="flex p-2 phone:justify-center phone:items-center phone:min-h-20 pl-4 pr-4 gap-3 border-b-2 border-neutral-800 shadow-lg">
      <div className="flex gap-2 items-center">
        <img src={user.image} className="w-7 h-7 object-cover rounded-full"></img>
        <Link to={`/users/${user._id}`}>
          <h1 className="text-white font-bold">{user.name}</h1>
        </Link>
      </div>
      <div className="w-0.5 bg-neutral-500 phone:min-h-6">
      </div>
      <Link to={`/users/${user._id}`}>
        <h1 className="text-gray-400 font-bold">{user.username && `@${user.username}`}</h1>
      </Link>
    </div>
  )
}

export default DMHeader;
