import React, { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notificationData) => {
      setNotifications((prev) => [...prev, notificationData]);
      setTimeout(() => {
        const notificationElement = document.querySelector(`.notification-${notificationData.id}`);
        if (notificationElement) {
          notificationElement.classList.add("fade-out");
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notificationData.id));
          }, 5000);
        }
      }, 5000);
    };

    socket.on("notification", handleNotification);

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    return () => {
      socket.off("notification", handleNotification);
      socket.off("connect_error");
    };
  }, [socket]);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification notification-${notification.id}`}>
          <p>{notification.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
