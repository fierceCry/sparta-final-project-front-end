import React, { useState, useEffect } from "react";
import { Bell, User, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client"; 
import "../../styles/chat/chat-page.scss";
import "../../styles/chat/chat-modal.scss";

const Chat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // 액세스 토큰을 로컬 스토리지나 쿠키에서 가져옵니다.
  const token = localStorage.getItem("accessToken"); // 예: localStorage

  const socket = io('http://localhost:3333', {
    auth: {
      token: `Bearer ${token}`, // JWT 토큰
    },
  });

  useEffect(() => {
    // 채팅방에 조인
    socket.emit("joinRoom", { userId: id }); 

    // 메시지 수신
    socket.on("receiveChat", (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    // 채팅 업데이트 수신
    socket.on("chatUpdated", (updatedChat) => {
      setChatMessages((prevMessages) => 
        prevMessages.map(chat => chat.id === updatedChat.id ? updatedChat : chat)
      );
    });

    // 채팅 삭제 수신
    socket.on("chatDeleted", ({ chatId }) => {
      setChatMessages((prevMessages) => 
        prevMessages.filter(chat => chat.id !== chatId)
      );
    });

    return () => {
      socket.off("receiveChat");
      socket.off("chatUpdated");
      socket.off("chatDeleted");
    };
  }, [id]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newChatMessage = {
        receiverId: 1, // 수신자 ID
        content: newMessage.trim(),
        chatRoomId: parseInt(id), 
      };

      socket.emit("sendChat", newChatMessage);
      setNewMessage("");
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleMainClick = () => {
    navigate("/main");
  };

  const handleReportClick = () => {
    navigate("/report");
  };

  return (
    <div className="chat-page">
      <header>
        <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
          JOB일
        </h1>
        <div className="header-icons">
          <input type="text" className="search-input" placeholder="검색..." />
          <Bell onClick={() => navigate("/notifications")} />
          <Send onClick={() => navigate("/chatlist")} />
          <User onClick={() => navigate("/user")} />
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-container">
          {chatMessages.map((chat) => (
            <div
              key={chat.id}
              className={`chat-message ${chat.senderId === 2 ? "sent" : "received"}`}
            >
              <div className="message-content">
                <p>{chat.content}</p>
              </div>
              <span className="sender-name">{chat.senderId === 2 ? "잡일 수락자" : "잡일 등록자"}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="chat-footer">
        <div className="input-group">
          <input
            className="message-input"
            placeholder="메시지를 입력하세요..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="send-button" onClick={handleSendMessage}>
            <Send size={20} />
          </button>
          <button className="action-button" onClick={toggleModal}>
            ...
          </button>
        </div>
      </footer>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={toggleModal}>
              X
            </button>
            <button>나가기</button>
            <button onClick={handleReportClick}>신고하기</button>
            <button>블랙리스트</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
