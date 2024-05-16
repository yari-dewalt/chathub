// @ts-nocheck
import FriendCircle from "./FriendCircle";

function FriendsArea({ friends }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-4xl font-bold text-white">Friends</h1>
      <div className="flex flex-wrap justify-center gap-2">
        {friends.map((friend) => (
          <FriendCircle key={friend._id} user={friend}/>
        ))}
      </div>
    </div>
  )
}

export default FriendsArea;
