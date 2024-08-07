import React, { useEffect, useState } from "react";
import { ChevronLeft, Bell, Send, User, Clock, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchJobs, acceptJob, rejectJob } from "../../services/job";
import "../../styles/jobs/job-matching.scss";

const JobMatching = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6; // 페이지당 보여줄 잡일 수

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const jobList = await fetchJobs(navigate);
        const formattedJobs = jobList.map((job) => {
          const createdAt = new Date(job.createdAt);
          const date = createdAt.toLocaleDateString();
          const time = createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return {
            id: job.id,
            title: job.job.title,
            date,
            time,
            userName: job.users.name,
            matchedYn: job.matchedYn,
            rejectedYn: job.rejectedYn,
            customerId: job.customerId,  // customerId 추가
          };
        });
        setJobs(formattedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [navigate]);

  const handleAccept = async (jobId) => {
    try {
      await acceptJob(jobId, navigate);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, matchedYn: true, rejectedYn: false } : job,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "수락 처리에 실패했습니다.");
    }
  };

  const handleReject = async (jobId) => {
    try {
      await rejectJob(jobId, navigate);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, matchedYn: false, rejectedYn: true } : job,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "거절 처리에 실패했습니다.");
    }
  };

  const handleChat = (customerId) => {
    navigate(`/chat/${customerId}`, { state: { receiverId: customerId } });
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

  const getStatusClass = (job) => {
    if (job.matchedYn) {
      return "matched"; // 초록색
    } else if (job.rejectedYn) {
      return "not-matched"; // 빨간색
    }
    return ""; // 대기중일 경우 아무 색상도 없음
  };

  // 현재 페이지에 맞는 잡일 목록을 가져오는 함수
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // 페이지 변경 핸들러
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
          <Bell onClick={() => navigate("/notifications")} />
          <Send onClick={() => navigate("/chatlist")} />
          <User onClick={() => navigate("/user")} />
        </div>
      </header>

      <main>
        <div className="content-container">
          <h2>매칭 확인 목록</h2>
          {loading && <p>로딩 중...</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="job-list">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div className={`job-item ${getStatusClass(job)}`} key={job.id}>
                  <div className="job-details">
                    <span className="job-title">잡일 : {job.title}</span>
                    <span className="applicant-name">지원자: {job.userName}</span>
                    <div className="job-footer"></div>
                  </div>
                  <div className="job-actions">
                    <span className="status-text">{getStatusText(job)}</span>
                    <button className="chat" onClick={() => handleChat(job.customerId)}>
                      채팅
                    </button>
                    <button className="accept" onClick={() => handleAccept(job.id)}>
                      수락
                    </button>
                    <button className="reject" onClick={() => handleReject(job.id)}>
                      거절
                    </button>
                    <div className="job-time">
                      <Clock style={{ marginRight: "4px" }} />
                      <span>
                        {job.date} {job.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>잡일 지원목록이 없습니다.</p>
            )}
          </div>

          {/* 페이지네이션 - 화살표 버튼 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                <ChevronLeft />
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobMatching;
