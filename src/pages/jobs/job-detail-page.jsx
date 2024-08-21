import React, { useEffect, useState } from "react";
import { Bell, Send, User, ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchJobDetail, applyForJob } from "../../services/job";
import "../../styles/jobs/job-detail-page.scss";

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadJobDetail = async () => {
      try {
        const jobData = await fetchJobDetail(id, navigate);
        setJob(jobData);
      } catch (err) {
        setError(err.message);
      }
    };

    loadJobDetail();
  }, [id, navigate]);

  const handleApply = async () => {
    try {
      await applyForJob(id, navigate);
      alert("지원이 완료되었습니다.");
      navigate("/main");
    } catch (err) {
      setError(err.message);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(value);
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!job) {
    return <p>로딩 중...</p>;
  }

  const handleReport = () => {
    if (job.ownerId) {
      navigate("/report", { state: { ownerId: job.ownerId } });
    } else {
      alert("소유자 ID가 없습니다.");
    }
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
                alt="Job location"
                className="job-image"
                onError={(e) => {
                  e.target.onerror = null; // 무한 루프 방지
                  e.target.src =
                    "https://i.namu.wiki/i/Bbq0E9hXYyrXbL4TnIE__vtQ2QwiZ3i40NZSLiX_a6S0ftYCndVZjf4vlruWur4I3Z0o7CZuFrRMl2CKxyk30w.webp"; // 대체 이미지 URL
                }}
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
                  <span className="label">급여:</span>
                  <span className="value">{formatCurrency(job.price)}원</span>
                </div>
                <div className="detail-row">
                  <span className="label">업무:</span>
                  <span className="value">{job.content}</span>
                </div>
                <div className="detail-row">
                  <span className="label">카테고리:</span>
                  <span className="value">{job.category}</span>
                </div>
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
