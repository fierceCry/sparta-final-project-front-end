import React, { useState, useEffect } from "react";
import { Bell, User, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/chat-page.scss";
import "../styles/chat-modal.scss";
import { mockChatData } from '../mock-data/chat';

const Chat = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 ID 가져오기
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // ID에 맞는 메시지 필터링
    const filteredMessages = mockChatData.filter((msg) => msg.chatRoomsId === parseInt(id));
    setChatMessages(filteredMessages);
  }, [id]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newChatMessage = {
        id: chatMessages.length + 1, // 새로운 ID 생성
        senderId: 2, // 수락자 ID (예시로 2로 설정)
        receiverId: 1, // 등록자 ID (예시로 1로 설정)
        chatRoomsId: parseInt(id), // 현재 채팅방 ID
        content: newMessage.trim(),
        createdAt: new Date(), // 현재 시간
        updatedAt: new Date(), // 현재 시간
        deletedAt: null, // 삭제일
      };
      setChatMessages([...chatMessages, newChatMessage]);
      setNewMessage("");
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

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
    <div className="chat-page">
      <header>
        <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
          JOB일
        </h1>
        <div className="header-icons">
          <input type="text" className="search-input" placeholder="검색..." />
          <Bell />
          <Send onClick={handleChatListClick} style={{ cursor: "pointer" }} />
          <User onClick={handleUserIconClick} style={{ cursor: "pointer" }} />
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-container">
          {chatMessages.map((chat) => (
            <div
              key={chat.id}
              className={`chat-message ${chat.senderId === 2 ? "sent" : "received"}`} // 수락자 ID에 따라 스타일 변경
            >
              <div className="message-content">
                <p>{chat.content}</p> {/* content 필드로 변경 */}
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
            <button>신고하기</button>
            <button>블랙리스트</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
