import { useNotification } from "../context/NotificationContext.jsx";
import api from "../utils/api.js";

export const useApiWithNotifications = () => {
  const { success, error: notifyError } = useNotification();

  const requestWithNotification = async (
    url,
    options = {},
    successMessage = null
  ) => {
    try {
      const response = await api(url, options);

      if (successMessage && response.data) {
        success(successMessage);
      }

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      notifyError(message);
      throw err;
    }
  };

  return { requestWithNotification };
};
