import React, { createContext, useContext, useReducer } from "react";

const NotificationContext = createContext();

// Notification types
const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    case "CLEAR_ALL":
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
  });

  const addNotification = (
    message,
    type = NOTIFICATION_TYPES.INFO,
    duration = 5000
  ) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };

    dispatch({ type: "ADD_NOTIFICATION", payload: notification });

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  // Helper methods for different notification types
  const success = (message, duration) =>
    addNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);

  const error = (message, duration) =>
    addNotification(message, NOTIFICATION_TYPES.ERROR, duration);

  const warning = (message, duration) =>
    addNotification(message, NOTIFICATION_TYPES.WARNING, duration);

  const info = (message, duration) =>
    addNotification(message, NOTIFICATION_TYPES.INFO, duration);

  const value = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
