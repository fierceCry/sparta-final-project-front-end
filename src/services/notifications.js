import axios from 'axios';
import { refreshAccessToken } from './auth.service';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchNotifications = async (token, navigate, page = 1, limit = 6) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newToken = await refreshAccessToken(navigate);
      if (newToken) {
        const retryResponse = await axios.get(`${API_URL}/api/v1/notifications`, {
          headers: {
            Authorization: `Bearer ${newToken}`
          },
          params: {
            page,
            limit
          }
        });
        return retryResponse.data;
      }
    }
    throw error;
  }
};

// 새로운 API 요청 추가
export const deleteNotification = async (token, navigate, notificationId) => {
  try {
    await axios.delete(`${API_URL}/api/v1/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newToken = await refreshAccessToken(navigate);
      if (newToken) {
        await axios.delete(`${API_URL}/api/v1/notifications/${notificationId}`, {
          headers: {
            Authorization: `Bearer ${newToken}`
          },
        });
      }
    } else if (error.response && error.response.status === 403) {
      console.error("권한이 없습니다.");
    }
    throw error;
  }
};

export const clearAllNotifications = async (token, navigate) => {
  try {
    await axios.delete(`${API_URL}/api/v1/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newToken = await refreshAccessToken(navigate);
      if (newToken) {
        await axios.delete(`${API_URL}/api/v1/notifications`, {
          headers: {
            Authorization: `Bearer ${newToken}`
          },
        });
      }
    } else if (error.response && error.response.status === 403) {
      console.error("권한이 없습니다.");
    }
    throw error;
  }
};
