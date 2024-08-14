// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const CallbackPage = () => {
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getCookie = (name) => {
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
//       console.log(value)
//       console.log(parts)
//       if (parts.length === 2) return parts.pop().split(';').shift();
//     };
//     console.log(getCookie)
//     const accessToken = getCookie('accessToken');
//     const refreshToken = getCookie('refreshToken'); // 이제 접근 가능
//     console.log(accessToken)
//     if (accessToken && refreshToken) {
//       // 쿠키에서 토큰을 성공적으로 가져왔을 때
//       localStorage.setItem('accessToken', accessToken);
//       localStorage.setItem('refreshToken', refreshToken);

//       // 메인 페이지로 리다이렉션
//       navigate('/main'); // 원하는 경로로 변경
//     } else {
//       // 토큰이 없는 경우 에러 처리
//       setError("로그인 처리 중 오류가 발생했습니다.");
//     }
//   }, [navigate]);

//   return (
//     <div>
//       <h1>로그인 중...</h1>
//       <p>잠시만 기다려 주세요.</p>
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default CallbackPage;

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
      console.log(urlParams);
      const code = urlParams.get('code');

      try {
        const response = await axios.post(`${API_URL}/api/v1/auth/code/token`, {
          code
        });

        if (response) {
          const { accessToken, refreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
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
