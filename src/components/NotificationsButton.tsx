// @ts-nocheck
import EmptyNotificationsIcon from "../assets/notifications_empty.svg";
import ActiveNotificationsIcon from "../assets/notifications_active.svg";

function NotificationsButton({ onClick, notifications }) {
  return (
    <button onClick={onClick} className="rounded-full p-2 bg-neutral-500 relative">
      <img src={notifications.length > 0 ? ActiveNotificationsIcon : EmptyNotificationsIcon} className="invert"></img>
      <div className={`absolute top-1 left-6 bg-neutral-700 rounded-full w-5 h-5 p-1 flex items-center justify-center ${notifications.length > 0 ? "opacity-100" : "opacity-0"}`}>
        <div className={`min-w-4 min-h-4 rounded-full bg-red-500 ${notifications.length > 0 ? "opacity-100" : "opacity-0"}`}>
          <p className="text-xs text-white">{notifications.length}</p>
        </div>
      </div>
    </button>
  )
}

export default NotificationsButton;
