import React, { useState } from "react";
import { Bell, Send, User, MoreVertical, ChevronLeft } from "lucide-react";
import "../styles/chat-list-page.scss";
import { useNavigate, Link } from "react-router-dom";

const ChatMessage = ({ sender, message }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleReportClick = () => {
    navigate("/report");
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="chat-message">
      <div className="chat-content">
        <h3>{sender}</h3>
        <p>{message}</p>
      </div>
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropdown-toggle">
          <MoreVertical size={16} />
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => setIsDropdownOpen(false)}>나가기</button>
            <button onClick={handleReportClick}>신고하기</button>
            <button>블랙리스트</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatListPage = () => {
  const navigate = useNavigate();
  const handleMainClick = () => {
    navigate("/main");
  };

  return (
    <div className="chat-list-page">
      <div className="main-content">
        <header>
          <div className="header-left">
            <Link to="/main" className="back-button">
              <ChevronLeft />
            </Link>
            <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
              JOB일
            </h1>
          </div>
          <div className="icons">
            <Bell />
            <Send />
            <User />
          </div>
        </header>
        <main>
          <ChatMessage sender="홍길동" message="어우 힘이 장사시네요." />
          <ChatMessage sender="박길동" message="감사합니다!! 덕분에 침 올렸어요." />
          <ChatMessage sender="홍길동" message="감사합니다!! 덕분에 잘 할 거예요." />
          <ChatMessage sender="최길동" message="감사합니다!! 덕분에 잘 될 거예요." />
        </main>
      </div>
    </div>
  );
};

export default ChatListPage;
