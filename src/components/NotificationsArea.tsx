// @ts-nocheck
import CloseIcon from "../assets/close.svg";
import Notification from "../components/Notification";

import { motion } from "framer-motion";

function NotificationsArea({ onClick, notifications, handleNotifications }) {
  return (
    <motion.div className="flex flex-col gap-1 relative min-h-full max-h-full w-72 items-center p-4 bg-neutral-800 overflow-y-auto"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
    >
      <h1 className="text-2xl text-white font-bold mb-8 mt-8">Notifications</h1>
      <button onClick={onClick} className="invert opacity-50 hover:opacity-85 absolute top-5 right-5">
        <img src={CloseIcon}></img>
      </button>
      {notifications.map((notification) => (
        <Notification key={notification._id} notification={notification} notifications={notifications} handleNotifications={handleNotifications}/>
      ))}
    </motion.div>
  )
}

export default NotificationsArea;
