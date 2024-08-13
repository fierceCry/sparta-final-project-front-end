import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const signin = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/sign-in`, {
      email,
      password,
    });

    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return response.data; // 반환값을 추가하여 처리할 수 있게 함
  } catch (error) {
    throw new Error("아이디와 비밀번호를 확인하세요.");
  }
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

// 소셜 로그인 핸들러 추가
export const handleKakaoLogin = () => {
  window.location.href = `${API_URL}/api/v1/auth/kakao`;
};

export const handleNaverLogin = () => {
  window.location.href = `${API_URL}/api/v1/auth/naver`;
};

export const handleGoogleLogin = () => {
  window.location.href = `${API_URL}/api/v1/auth/google`;
};

// 구글 로그인 콜백 처리
export const handleCallback = async () => {
  try {
    console.log(2)
    const response = await axios.get(`${API_URL}/api/v1/auth/google/callback`);
    const data = response.data; // axios는 자동으로 JSON으로 변환

    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    } else {
      // 오류 처리
      console.error("토큰이 없습니다.");
    }
  } catch (error) {
    console.error("콜백 처리 중 오류 발생:", error);
  }
};