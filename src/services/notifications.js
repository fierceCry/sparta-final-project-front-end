import axios from 'axios';
import { refreshAccessToken } from './auth.service';

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const handle401Error = async (navigate, requestFunc, ...args) => {
  const newToken = await refreshAccessToken(navigate);
  if (newToken) {
    return requestFunc(...args, newToken);
  }
  throw new Error("액세스 토큰을 갱신할 수 없습니다.");
};

export const fetchNotifications = async (token, navigate, page = 1, limit = 6) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/notifications`, {
      ...getAuthHeaders(token),
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return handle401Error(navigate, fetchNotifications, navigate, page, limit);
    }
    throw error;
  }
};

export const deleteNotification = async (token, navigate, notificationId) => {
  try {
    await axios.delete(`${API_URL}/api/v1/notifications/${notificationId}`, getAuthHeaders(token));
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return handle401Error(navigate, deleteNotification, navigate, notificationId);
    }
    throw error;
  }
};

export const clearAllNotifications = async (token, navigate) => {
  try {
    await axios.delete(`${API_URL}/api/v1/notifications`, getAuthHeaders(token));
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return handle401Error(navigate, clearAllNotifications, navigate);
    }
    throw error;
  }
};
