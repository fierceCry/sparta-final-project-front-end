import React, { useEffect, useState } from "react";
import { Bell, Send, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchJobs, fetchNotices } from '../../services/main';
import "../../styles/main/main-page.scss";
import { useSocket } from "../../contexts/SocketContext"; // useSocket 훅 임포트

const MainPageContent = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [noticePage, setNoticePage] = useState(1);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]); // 알림 상태 추가
  const [totalNoticePages, setTotalNoticePages] = useState(1); // 전체 공지사항 페이지 수 상태

  const noticesPerPage = 2;

  const socket = useSocket(); // 소켓 인스턴스 가져오기

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      navigate("/sign-in");
      return;
    }

    const loadJobs = async () => {
      try {
        const jobsData = await fetchJobs(token, navigate);
        setJobs(jobsData);
      } catch (err) {
        setError(err.message);
      }
    };

    loadJobs();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      navigate("/sign-in");
      return;
    }

    const loadNotices = async () => {
      try {
        const { data, meta } = await fetchNotices(token, navigate, noticePage, noticesPerPage);
        setNotices(data);
        setTotalNoticePages(meta.totalPages); // 전체 페이지 수 설정
      } catch (err) {
        setError(err.message);
      }
    };

    loadNotices();
  }, [noticePage, navigate]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notificationData) => {
      setNotifications((prev) => [...prev, notificationData]);
      setTimeout(() => {
        const notificationElement = document.querySelector(`.notification-${notificationData.id}`);
        if (notificationElement) {
          notificationElement.classList.add('fade-out');
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notificationData.id));
          }, 5000); // fadeOut 애니메이션 시간과 일치시킴
        }
      }, 5000); // 5초 후 알림 제거
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  const handleMainClick = () => {
    navigate("/main");
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalNoticePages) return;
    setNoticePage(newPage);
  };

  return (
    <div className="main-page">
      <header>
        <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
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
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <Link to={`/job/${job.id}`} key={job.id} className="alarm-card">
                    <div className="card-content">
                      <h3>{job.title}</h3>
                      <p>급여 {job.price}원</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>잡일이 없습니다.</p>
              )}
            </div>
          </div>
          <div className="notice-board">
            <div className="notice-board-header">
              <h2>공지사항</h2>
              <Link to="/create-notice" className="create-notice-button">
                공지사항 생성
              </Link>
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
                onClick={() => handlePageChange(noticePage - 1)}
                disabled={noticePage === 1}
              >
                <ChevronLeft />
              </button>
              <span>
                {noticePage} / {totalNoticePages}
              </span>
              <button
                onClick={() => handlePageChange(noticePage + 1)}
                disabled={noticePage === totalNoticePages}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 알림 메시지 표시 */}
      <div className="notification-container">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification notification-${notification.id}`}>
            <p>{notification.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPageContent;
