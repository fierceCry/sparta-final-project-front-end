import axios from 'axios';
import { refreshAccessToken } from './auth.service';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchNotifications = async (token, navigate, page = 1, limit = 6) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    console.log(response)
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // 토큰 만료 시 처리
      const newToken = await refreshAccessToken(navigate);
      if (newToken) {
        // 새 토큰으로 다시 요청
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
