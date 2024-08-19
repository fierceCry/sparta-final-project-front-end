import axios from 'axios';
import { refreshAccessToken } from './auth.service';

const API_URL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('accessToken');

const handle401Error = async (navigate, requestFunc, ...args) => {
  const newToken = await refreshAccessToken(navigate);
  if (newToken) {
    localStorage.setItem('accessToken', newToken); // 새 토큰 저장
    return requestFunc(...args); // 새로운 토큰으로 원래 요청을 다시 시도
  }
  throw new Error("액세스 토큰을 갱신할 수 없습니다.");
};

export const fetchJobs = async (navigate) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/job-matching/applications`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data.Matching || [];
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return handle401Error(navigate, fetchJobs, navigate);
    }
    throw new Error("잡일 목록을 가져오는 데 실패했습니다.");
  }
};

export const acceptJob = async (jobId, navigate) => {
  try {
    await axios.patch(`${API_URL}/api/v1/job-matching/accept/${jobId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return handle401Error(navigate, acceptJob, jobId, navigate);
    }
    throw new Error("수락 처리에 실패했습니다.");
  }
};

export const rejectJob = async (jobId, navigate) => {
  try {
    await axios.patch(`${API_URL}/api/v1/job-matching/reject/${jobId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return handle401Error(navigate, rejectJob, jobId, navigate);
    }
    throw new Error("거절 처리에 실패했습니다.");
  }
};

export const fetchJobDetail = async (id, navigate) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/api/v1/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.job;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const newToken = await refreshAccessToken(navigate);
      if (newToken) {
        return fetchJobDetail(id, navigate);
      }
    }
    throw new Error("잡 정보 가져오는 데 실패했습니다.");
  }
};

export const applyForJob = async (id, navigate) => {
  try {
    const token = localStorage.getItem('accessToken');
    await axios.post(`${API_URL}/api/v1/job-matching/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(1)
    return true; // 지원 성공
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const newToken = await refreshAccessToken(navigate);
      if (newToken) {
        return applyForJob(id, navigate);
      }
    }
    throw new Error("지원하는 데 실패했습니다.");
  }
};
