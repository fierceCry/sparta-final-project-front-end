import React, { useState } from "react";
import "../../styles/notifications/notifications-page.scss";
import { Bell, Send, User, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AlarmList = () => {
  const navigate = useNavigate();

  const alarms = [
    { id: 1, message: "알람 1: 오늘 회의가 있습니다." },
    { id: 2, message: "알람 2: 프로젝트 마감일이 다가옵니다." },
    { id: 3, message: "알람 3: 점심시간입니다!" },
    { id: 4, message: "알람 4: 운동할 시간입니다." },
  ];
  
  const handleMainClick = () => {
    navigate("/main");
  };

  const [openDropdown, setOpenDropdown] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const clearAllAlarms = () => {
    console.log("모든 알람이 지워졌습니다.");
  };

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
            <button onClick={toggleOptions}>⋮</button>
            {showOptions && (
              <div className="options-menu">
                <button>알림 켜기</button>
                <button>알림 10분간 비활성화</button>
                <button>알림 비활성화</button>
              </div>
            )}
          </div>
          {alarms.map((alarm) => (
            <div key={alarm.id} className="chat-message">
              <div className="chat-content">
                <h3>{alarm.message}</h3>
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
                    <button>삭제</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default AlarmList;
