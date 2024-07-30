import React, { useEffect, useState } from "react";
import { Bell, Send, User, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/chat/chat-list-page.scss";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { refreshAccessToken } from '../../services/auth.service';

const ChatMessage = ({ sender, message, lastMessageTime, onReport, onClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(false); 
    onReport(); 
  };

  return (
    <div className="chat-message" onClick={onClick}>
      <div className="chat-content">
        <h3>{sender}</h3>
        <p>{message}</p>
        <span className="last-message-time">{lastMessageTime}</span>
      </div>
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropdown-toggle">
          <MoreVertical size={16} />
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={handleReportClick}>신고하기</button>
            <button onClick={() => setIsDropdownOpen(false)}>나가기</button>
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
  const [chatList, setChatList] = useState([]); 
  const [error, setError] = useState(null);
  const messagesPerPage = 5;

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/chat-rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setChatList(response.data.findAllChatRooms || []); 
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newToken = await refreshAccessToken(navigate);
          if (newToken) {
            fetchChatList();
          }
        } else {
          setError("채팅 목록을 가져오는 데 실패했습니다.");
          console.error(err);
        }
      }
    };

    fetchChatList();
  }, [navigate]);

  const handleMainClick = () => {
    navigate("/main");
  };

  const handleReportClick = () => {
    console.log("신고하기 클릭");
    navigate(`/report`); 
  };

  const handleChatClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = chatList.slice(indexOfFirstMessage, indexOfLastMessage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(chatList.length / messagesPerPage);

  if (error) {
    return <div>{error}</div>;
  }

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
            <Bell onClick={() => navigate("/notifications")} />
            <Send onClick={() => navigate("/chatlist")} />
            <User onClick={() => navigate("/user")} />
          </div>
        </header>
        <main>
          {currentMessages.length > 0 ? (
            currentMessages.map(({ roomId, receiverName, lastMessage, lastMessageTime }) => (
              <ChatMessage
                key={roomId}
                sender={receiverName}
                message={lastMessage}
                lastMessageTime={new Date(lastMessageTime).toLocaleString()}
                onReport={handleReportClick} 
                onClick={() => handleChatClick(roomId)}
              />
            ))
          ) : (
            <div>채팅 목록이 없습니다.</div>
          )}
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
