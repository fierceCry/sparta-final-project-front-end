import React, { useEffect, useState } from "react";
import { Bell, Send, User, ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import "../../styles/jobs/job-detail-page.scss";
import { refreshAccessToken } from '../../services/auth.serivce';

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Job Detail Response:", response.data);
        setJob(response.data.job);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newToken = await refreshAccessToken(navigate);
          if (newToken) {
            fetchJobDetail();
          }
        } else {
          setError("잡 정보 가져오는 데 실패했습니다.");
        }
      }
    };

    fetchJobDetail();
  }, [id, navigate]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/job-matching/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("지원이 완료되었습니다.");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newToken = await refreshAccessToken(navigate);
        if (newToken) {
          handleApply(); 
        }
      } else {
        setError("지원하는 데 실패했습니다.");
      }
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!job) {
    return <p>로딩 중...</p>;
  }

  const handleReport = () => {
    navigate("/report");
  };

  const handleMainClick = () => {
    navigate("/main");
  };

  return (
    <div className="job-detail-page">
      <header>
        <div className="header-left">
          <Link to="/main" className="back-button">
            <ChevronLeft />
          </Link>
          <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
            JOB일
          </h1>
        </div>
        <div className="header-right">
        <Bell onClick={() => navigate("/notifications")} />
          <Send onClick={() => navigate("/chatlist")} />
          <User onClick={() => navigate("/user")} />
        </div>
      </header>
      <main>
        <div className="job-card">
          <div className="job-content">
            <div className="job-image-container">
              <img
                src={job.photoUrl}
                alt={`Job location`}
                className="job-image"
              />
            </div>
            <div className="job-info">
              <h2>{job.title}</h2>
              <div className="job-details">
                <div className="detail-row">
                  <span className="label">위치:</span>
                  <span className="value">{job.address}</span>
                </div>
                <div className="detail-row">
                  <span className="label">보수:</span>
                  <span className="value">{job.price}원</span>
                </div>
                <div className="detail-row">
                  <span className="label">업무:</span>
                  <span className="value">{job.content}</span>
                </div>
              </div>
              <div className="map-container">
                <img
                  src="https://example.com/path-to-map-image.jpg"
                  alt="Job location map"
                  className="map-image"
                />
              </div>
            </div>
          </div>
          <div className="button-group">
            <button className="apply-button" onClick={handleApply}>
              지원하기
            </button>
            <button className="save-button" onClick={handleReport}>
              신고하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailPage;
