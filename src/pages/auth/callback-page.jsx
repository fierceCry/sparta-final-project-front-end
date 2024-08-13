import React, { useEffect, useState } from 'react';
import { handleCallback } from '../../services/sign-in-page';

const CallbackPage = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        await handleCallback();
      } catch (err) {
        console.error("Error during token fetch:", err);
        setError("로그인 처리 중 오류가 발생했습니다.");
      }
    };

    fetchTokens();
  }, []);

  return (
    <div>
      <h1>로그인 중...</h1>
      <p>잠시만 기다려 주세요.</p>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CallbackPage;
