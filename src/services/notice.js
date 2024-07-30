// services/notice.js
import axios from 'axios';
import { refreshAccessToken } from './auth.service';

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const handle401Error = async (navigate, requestFunc, ...args) => {
  const newToken = await refreshAccessToken(navigate);
  if (newToken) {
    return requestFunc(...args, newToken); // 새로운 토큰으로 원래 요청을 다시 시도
  }
  throw new Error("액세스 토큰을 갱신할 수 없습니다.");
};

export const fetchNoticeDetail = async (id, navigate) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/notices/${id}`, getAuthHeaders());
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return handle401Error(navigate, fetchNoticeDetail, id, navigate);
    }
    throw new Error("공지사항을 가져오는 데 실패했습니다.");
  }
};

export const deleteNotice = async (id, navigate) => {
  try {
    await axios.delete(`${API_URL}/api/v1/notices/${id}`, getAuthHeaders());
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return handle401Error(navigate, deleteNotice, id, navigate);
    }
    throw new Error("공지사항 삭제에 실패했습니다.");
  }
};

export const updateNotice = async (id, updatedNotice, navigate) => {
  try {
    await axios.patch(`${API_URL}/api/v1/notices/${id}`, updatedNotice, getAuthHeaders());
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return handle401Error(navigate, updateNotice, id, updatedNotice, navigate);
    }
    throw new Error("공지사항 수정에 실패했습니다.");
  }
};
