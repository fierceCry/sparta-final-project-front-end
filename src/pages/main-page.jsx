import React, { useEffect, useState } from "react";
import { Bell, Send, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/main-page.scss";

const MainPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [notices, setNotices] = useState([]); 
  const [jobPage, setJobPage] = useState(1);
  const [noticePage, setNoticePage] = useState(1);
  const [error, setError] = useState(null);

  const jobsPerPage = 6;
  const noticesPerPage = 2;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Jobs Response:", response.data);
        if (Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
        } else {
          setError("잡일 목록을 가져오는 데 실패했습니다.");
        }
      } catch (err) {
        setError("잡일 목록을 가져오는 데 실패했습니다.");
      }
    };

    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/notices`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log("Notices Response:", response.data); 
        if (Array.isArray(response.data.data)) {
          setNotices(response.data.data); 
        } else {
          setError("공지사항 목록을 가져오는 데 실패했습니다.");
        }
      } catch (err) {
        setError("공지사항 목록을 가져오는 데 실패했습니다.");
      }
    };

    fetchJobs();
    fetchNotices();
  }, []);

  const indexOfLastJob = jobPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const indexOfLastNotice = noticePage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);

  const totalJobPages = Math.ceil(jobs.length / jobsPerPage);
  const totalNoticePages = Math.ceil(notices.length / noticesPerPage);

  const handleUserIconClick = () => {
    navigate("/user");
  };

  const handleChatListClick = () => {
    navigate("/chatlist");
  };

  const handleMainClick = () => {
    navigate("/main");
  };

  return (
    <div className="main-page">
      <header>
        <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
          JOB일
        </h1>
        <div className="header-icons">
          <input type="text" placeholder="JOB일 검색" className="search-input" />
          <Bell />
          <Send onClick={handleChatListClick} style={{ cursor: "pointer" }} />
          <User onClick={handleUserIconClick} style={{ cursor: "pointer" }} />
        </div>
      </header>

      <main>
        <div className="content-container">
          {error && <p className="error-message">{error}</p>}
          <div className="job-list">
            <div className="job-list-header">
              <h2>잡일 목록</h2>
              <Link to="/register-job" className="register-button">
                잡일 등록
              </Link>
            </div>
            <div className="alarm-grid">
              {currentJobs.length > 0 ? (
                currentJobs.map((job) => (
                  <Link to={`/job/${job.id}`} key={job.id} className="alarm-card">
                    <div className="card-content">
                      <h3>{job.title}</h3>
                      <p>시작 {job.price}원</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>잡일이 없습니다.</p>
              )}
            </div>
            <div className="pagination">
              <button
                onClick={() => setJobPage((prev) => Math.max(prev - 1, 1))}
                disabled={jobPage === 1}
              >
                <ChevronLeft />
              </button>
              <span>
                {jobPage} / {totalJobPages}
              </span>
              <button
                onClick={() => setJobPage((prev) => Math.min(prev + 1, totalJobPages))}
                disabled={jobPage === totalJobPages}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="notice-board">
            <h2>공지사항</h2>
            {currentNotices.map((notice) => (
              <Link to={`/notice/${notice.id}`} key={notice.id} className="notice-content">
                <h3>{notice.title}</h3>
                <p>{notice.description}</p>
              </Link>
            ))}
            <div className="pagination">
              <button
                onClick={() => setNoticePage((prev) => Math.max(prev - 1, 1))}
                disabled={noticePage === 1}
              >
                <ChevronLeft />
              </button>
              <span>
                {noticePage} / {totalNoticePages}
              </span>
              <button
                onClick={() => setNoticePage((prev) => Math.min(prev + 1, totalNoticePages))}
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

export default MainPage;
