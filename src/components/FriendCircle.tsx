// @ts-nocheck
import { Link } from "react-router-dom";

function FriendCircle({ user }) {
  return (
    <div className="flex flex-col items-center">
      <Link to={`/users/${user._id}`}>
        <div className="p-1 rounded-full transition-color duration-150 hover:ring-4 ring-indigo-400  flex items-center justify-center">
          <img src={user.image} className="w-32 h-32 rounded-full object-cover"></img>
        </div>
      </Link>
      <Link to={`/users/${user._id}`}>
        <h2 className="text-white text-center font-bold text-2xl hover:underline underline-offset-1">{user.name}</h2>
      </Link>
    </div>
  )
}

export default FriendCircle;
