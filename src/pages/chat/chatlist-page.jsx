import React, { useEffect, useState } from "react";
import { Bell, Send, User, ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/chat/chat-list-page.scss";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { refreshAccessToken } from '../../services/auth.service';
import ChatMessage from './chat-message'; // ChatMessage 컴포넌트 임포트

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
        setChatList(response.data.findAllChatRooms || []); 
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newToken = await refreshAccessToken(navigate);
          if (newToken) {
            localStorage.setItem('accessToken', newToken); // 새 토큰 저장
            fetchChatList(); // 새로운 토큰으로 다시 시도
          }
        } else {
          setError("채팅 목록을 가져오는 데 실패했습니다.");
        }
      }
    };

    fetchChatList();
  }, [navigate]);

  const handleMainClick = () => {
    navigate("/main");
  };

  const handleReportClick = (ownerId) => {
    navigate(`/report`, { state: { ownerId } }); 
  };

  const handleChatClick = (roomId, receiverId, receiverName) => {
    navigate(`/chat/${roomId}`, { state: { receiverId, receiverName } });
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
            currentMessages.map(({ roomId, receiverId, receiverName, lastMessage, lastMessageTime }) => (
              <ChatMessage
                key={roomId}
                sender={receiverName}
                message={lastMessage}
                lastMessageTime={lastMessageTime ? new Date(lastMessageTime).toLocaleString() : new Date().toLocaleString()}
                onReport={() => handleReportClick(receiverId)} // receiverId를 ownerId로 사용
                onClick={() => handleChatClick(roomId, receiverId, receiverName)}
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
