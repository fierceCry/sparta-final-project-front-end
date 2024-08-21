import React, { useEffect, useState } from "react";
import { Bell, Send, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchJobs, fetchNotices } from "../../services/main";
import "../../styles/main/main-page.scss";

const MainPageContent = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [paginatedJobs, setPaginatedJobs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [noticePage, setNoticePage] = useState(1);
  const [jobPage, setJobPage] = useState(1);
  const [error, setError] = useState(null);
  const [totalNoticePages, setTotalNoticePages] = useState(1);
  const [totalJobPages, setTotalJobPages] = useState(1);
  const [role, setRole] = useState("");

  const noticesPerPage = 2;
  const jobsPerPage = 8;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/sign-in");
      return;
    }

    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }

    const loadJobs = async () => {
      try {
        const allJobs = await fetchJobs(token, navigate);
        setJobs(allJobs);
        setTotalJobPages(Math.ceil(allJobs.length / jobsPerPage));
      } catch (err) {
        setError("잡일을 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadJobs();
  }, [navigate]);

  useEffect(() => {
    const startIndex = (jobPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    setPaginatedJobs(jobs.slice(startIndex, endIndex));
  }, [jobs, jobPage]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/sign-in");
      return;
    }

    const loadNotices = async () => {
      try {
        const { data, meta } = await fetchNotices(token, navigate, noticePage, noticesPerPage);
        setNotices(data);
        setTotalNoticePages(meta.totalPages);
      } catch (err) {
        setError("공지사항을 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadNotices();
  }, [noticePage, navigate]);

  const handlePageChange = (newPage, type) => {
    if (type === "notice") {
      if (newPage < 1 || newPage > totalNoticePages) return;
      setNoticePage(newPage);
    } else if (type === "job") {
      if (newPage < 1 || newPage > totalJobPages) return;
      setJobPage(newPage);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="main-page">
      <header>
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
          {error && <p className="error-message">{error}</p>}
          <div className="job-list">
            <div className="job-list-header">
              <h2>잡일 목록</h2>
              <Link to="/job-matching" className="register-list-button">
                내가 받은 지원 목록
              </Link>
              <Link to="/register-job" className="register-button">
                잡일 등록
              </Link>
            </div>
            <div className="alarm-grid">
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <Link to={`/job/${job.id}`} key={job.id} className="alarm-card">
                    <div className="card-content">
                      <h3>{job.title}</h3>
                      <p>급여 {formatCurrency(job.price)}원</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>잡일이 없습니다.</p>
              )}
            </div>
            <div className="pagination">
              <button onClick={() => handlePageChange(jobPage - 1, "job")} disabled={jobPage === 1}>
                <ChevronLeft />
              </button>
              <span>
                {jobPage} / {totalJobPages}
              </span>
              <button
                onClick={() => handlePageChange(jobPage + 1, "job")}
                disabled={jobPage === totalJobPages}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="notice-board">
            <div className="notice-board-header">
              <h2>공지사항</h2>
              {role === "ADMIN" && (
                <Link to="/create-notice" className="create-notice-button">
                  공지사항 생성
                </Link>
              )}
            </div>
            <div className="notices-container">
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <Link to={`/notice/${notice.id}`} key={notice.id} className="notice-content">
                    <h3>{truncateText(notice.title, 20)}</h3>
                    <p>{truncateText(notice.description, 50)}</p>
                  </Link>
                ))
              ) : (
                <p>공지사항이 없습니다.</p>
              )}
            </div>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(noticePage - 1, "notice")}
                disabled={noticePage === 1}
              >
                <ChevronLeft />
              </button>
              <span>
                {noticePage} / {totalNoticePages}
              </span>
              <button
                onClick={() => handlePageChange(noticePage + 1, "notice")}
                disabled={noticePage === totalNoticePages}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPageContent;
