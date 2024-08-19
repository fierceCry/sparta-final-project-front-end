import axios from 'axios';
import { refreshAccessToken } from './auth.service';

export const fetchJobs = async (token, navigate) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/jobs`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.jobs;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const newToken = await refreshAccessToken(navigate);
      if (newToken) {
        return fetchJobs(newToken, navigate); // 새 토큰으로 다시 요청
      }
    }
    throw new Error("잡일 목록을 가져오는 데 실패했습니다.");
  }
};

export const fetchNotices = async (token, navigate, page, limit) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/notices`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { page, limit } // 페이지 번호와 항목 수를 쿼리 파라미터로 전달
    });
    return {
      data: response.data.data, // 공지사항 데이터
      meta: response.data.meta // 메타데이터 (페이지, 항목 수 등)
    };
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const newToken = await refreshAccessToken(navigate);
      if (newToken) {
        return fetchNotices(newToken, navigate, page, limit); // 새 토큰으로 다시 요청
      }
    }
    throw new Error("공지사항 목록을 가져오는 데 실패했습니다.");
  }
};
