import React, { useEffect, useState } from "react";
import { ChevronLeft, Bell, Send, User, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { refreshAccessToken } from "../../services/auth.serivce";
import "../../styles/jobs/job-matching.scss";

const JobMatching = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/sign-in");
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/job-matching/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setJobs(response.data.Matching || []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newToken = await refreshAccessToken(navigate);
          if (newToken) {
            fetchJobs();
          }
        } else {
          setError("잡일 목록을 가져오는 데 실패했습니다.");
        }
      }
    };

    fetchJobs();
  }, [navigate]);

  const handleAccept = async (jobId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/v1/job-matching/accept/${jobId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Job ${jobId} accepted`);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, matchedYn: true, rejectedYn: false } : job
        )
      );
    } catch (err) {
      console.error("수락 처리 중 오류 발생:", err);
      setError("수락 처리에 실패했습니다.");
    }
  };

  const handleReject = async (jobId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/v1/job-matching/reject/${jobId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Job ${jobId} rejected`);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, matchedYn: false, rejectedYn: true } : job
        )
      );
    } catch (err) {
      console.error("거절 처리 중 오류 발생:", err);
      setError("거절 처리에 실패했습니다.");
    }
  };

  const handleChat = (jobId) => {
    navigate(`/chat/${jobId}`);
  };

  const getStatusText = (job) => {
    if (job.matchedYn) {
      return "수락완료";
    } else if (job.rejectedYn) {
      return "거절완료";
    } else {
      return "대기중";
    }
  };

  return (
    <div className="job-matching">
      <header>
        <Link to="/main" className="report-page__back-button">
          <ChevronLeft />
        </Link>
        <h1 onClick={() => navigate("/main")} style={{ cursor: "pointer" }}>
          JOB일
        </h1>
        <div className="header-icons">
          <input type="text" placeholder="JOB일 검색" className="search-input" />
          <Bell onClick={() => navigate("/notifications")} />
          <Send onClick={() => navigate("/chatlist")} />
          <User onClick={() => navigate("/user")} />
        </div>
      </header>

      <main>
        <div className="content-container">
          <h2>매칭 확인 목록</h2>
          {error && <p className="error-message">{error}</p>}

          <div className="job-list">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div className={`job-item ${job.status}`} key={job.id}>
                  <span>
                    {job.date} - {job.title} - {getStatusText(job)}
                  </span>
                  <div className="job-actions">
                      <Clock style={{ marginRight: "4px" }} />
                    <span>{getStatusText(job)}</span>
                    <button onClick={() => handleChat(job.id)}>
                      채팅
                    </button>
                    <button onClick={() => handleAccept(job.id)}>수락</button>
                    <button onClick={() => handleReject(job.id)}>삭제</button>
                  </div>
                </div>
              ))
            ) : (
              <p>잡일 지원목록이 없습니다.</p>
            )}
          </div>

          <div className="load-more">
            <button>더보기</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobMatching;
