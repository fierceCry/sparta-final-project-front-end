import React, { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext";
import '../../styles/notifications/Notifications.scss'

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notificationData) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notificationData.id)) {
          return prev;
        }
        return [...prev, { ...notificationData, fading: false }];
      });

      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationData.id ? { ...n, fading: true } : n
          )
        );
      }, 4500); // 4.5초 후에 fade-out 시작

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationData.id));
      }, 5000); // 5초 후에 알림 제거
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
        <div
          key={notification.id}
          className={`notification ${notification.fading ? "fade-out" : ""}`}
        >
          <p>{notification.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;