// services/users.js
import axios from 'axios';
import { refreshAccessToken } from './auth.service';

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  console.log(token)
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const handle401Error = async (navigate, requestFunc, ...args) => {
  const newToken = await refreshAccessToken(navigate);
  if (newToken) {
    return requestFunc(...args, newToken); // 새로운 토큰으로 원래 요청을 다시 시도
  }
  throw new Error("액세스 토큰을 갱신할 수 없습니다.");
};

export const fetchUserInfo = async (navigate) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/users/me`, getAuthHeaders());
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return handle401Error(navigate, fetchUserInfo, navigate);
    }
    throw new Error("사용자 정보를 가져오는 데 실패했습니다.");
  }
};

export const updateUserInfo = async (userInfo, navigate) => {
  try {
    await axios.patch(`${API_URL}/api/v1/users/me`, userInfo, getAuthHeaders());
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return handle401Error(navigate, updateUserInfo, userInfo, navigate);
    }
    throw new Error(err.response.data.message);
  }
};

export const logoutUser = async (navigate) => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log(token)
    await axios.patch(`${API_URL}/api/v1/auth/sign-out`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate("/sign-in");
  } catch (err) {
    throw new Error("로그아웃에 실패했습니다.");
  }
};

export const quitUser = async (navigate) => {
  try {
    await axios.patch(`${API_URL}/api/v1/users/quit`, {}, getAuthHeaders());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate("/sign-in");
  } catch (err) {
    throw new Error("회원탈퇴에 실패했습니다.");
  }
};
