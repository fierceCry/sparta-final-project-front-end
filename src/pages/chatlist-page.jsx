import React, { useState } from "react";
import { Bell, Send, User, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/chat-list-page.scss";
import { useNavigate, Link } from "react-router-dom";
import { chatList } from '../mock-data/chat-list';

const ChatMessage = ({ sender, message, onReport, onClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="chat-message" onClick={onClick}>
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
            <button onClick={onReport}>신고하기</button>
            <button>블랙리스트</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  const handleMainClick = () => {
    navigate("/main");
  };

  const handleReportClick = (id) => {
    console.log(`신고하기: ${id}`);
    navigate("/report");
  };

  const handleChatClick = (id) => {
    navigate(`/chat/${id}`);
  };

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = chatList.slice(indexOfFirstMessage, indexOfLastMessage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(chatList.length / messagesPerPage);

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
          {currentMessages.map(({ id, sender, message }) => (
            <ChatMessage
              key={id}
              sender={sender}
              message={message}
              onReport={() => handleReportClick(id)}
              onClick={() => handleChatClick(id)}
            />
          ))}
        </main>
        <footer className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="arrow-button"
          >
            <ChevronLeft />
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="arrow-button"
          >
            <ChevronRight />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ChatListPage;
