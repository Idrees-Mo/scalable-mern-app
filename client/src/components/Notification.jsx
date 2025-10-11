import React from "react";
import { useNotification } from "../context/NotificationContext.jsx";
import "./Notification.css";

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
            >
              ×
            </button>
          </div>
          {notification.duration > 0 && (
            <div
              className="notification-progress"
              style={{
                animationDuration: `${notification.duration}ms`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Notification;
