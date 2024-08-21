import React, { useState, useEffect, useCallback } from "react";
import "../../styles/notifications/notifications-page.scss";
import { Bell, Send, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchNotifications, deleteNotification, clearAllNotifications } from '../../services/notifications';

const AlarmList = () => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchAndSetNotifications = useCallback(async (page) => {
    const token = localStorage.getItem('accessToken');
    try {
      const data = await fetchNotifications(token, navigate, page, itemsPerPage);
      if (data && Array.isArray(data.data)) {
        setAlarms(data.data);
      }
    } catch (err) {
    }
  }, [navigate, itemsPerPage]);

  useEffect(() => {
    fetchAndSetNotifications(currentPage);
  }, [fetchAndSetNotifications, currentPage]);

  const handleMainClick = () => {
    navigate("/main");
  };

  const [openDropdown, setOpenDropdown] = useState(null);
  // const [showOptions, setShowOptions] = useState(false);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const clearAllAlarms = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await clearAllNotifications(token, navigate);
      setAlarms([]); // 알림 목록 비우기
    } catch (err) {
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await deleteNotification(token, navigate, notificationId);
      setAlarms((prevAlarms) => prevAlarms.filter(alarm => alarm.id !== notificationId)); // 삭제된 알림 제외
    } catch (err) {
    }
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    
    // 서버에서 받은 UTC 시간을 로컬 시간대로 변환
    const past = new Date(dateString); // UTC로 해석
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAlarms = alarms.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(alarms.length / itemsPerPage);

  return (
    <div className="chat-list-page">
      <div className="main-content">
        <header>
          <Link to="/main" className="back-button">
            <ChevronLeft />
          </Link>
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
          <div className="clear-all">
            <button onClick={clearAllAlarms}>알람 전체 지우기</button>
            {/* <button onClick={toggleOptions}>⋮</button>
            {showOptions && (
              <div className="options-menu">
                <button>알림 켜기</button>
                <button>알림 10분간 비활성화</button>
                <button>알림 비활성화</button>
              </div>
            )} */}
          </div>
          {Array.isArray(currentAlarms) && currentAlarms.map((alarm) => (
            <div key={alarm.id} className="chat-message">
              <div className="chat-content">
                <h3>{alarm.title}</h3>
                <p>{alarm.senderName}</p>
                <p>{getRelativeTime(alarm.createdAt)}</p>
              </div>
              <div className="dropdown">
                <button
                  className="dropdown-toggle"
                  onClick={() => toggleDropdown(alarm.id)}
                >
                  ⋮
                </button>
                {openDropdown === alarm.id && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleDeleteNotification(alarm.id)}>삭제</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AlarmList;
