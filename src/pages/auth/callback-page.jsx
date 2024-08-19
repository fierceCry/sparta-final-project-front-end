import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 'from' 키워드 추가

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => { // 비동기 함수 정의
      const API_URL = process.env.REACT_APP_API_URL;

      // 현재 URL에서 토큰 추출
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      console.log(authCode)
      try {
        const response = await axios.get(`${API_URL}/api/v1/auth/auth-code/${encodeURIComponent(authCode)}`);

        console.log(response.data[0])
        console.log(response.data[1])
        if (response) {
          localStorage.setItem("accessToken", response.data[0]);
          localStorage.setItem("refreshToken", response.data[1]);
          navigate('/main'); // 성공적으로 토큰을 저장한 후 리다이렉트
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken(); // 비동기 함수 호출
  }, [navigate]);

  return (
    <div>
      <h1>로그인 처리 중...</h1>
    </div>
  );
};

export default CallbackPage;
