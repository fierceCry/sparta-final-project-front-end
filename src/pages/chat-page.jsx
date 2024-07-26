import React, { useState, useEffect } from "react";
import { Bell, User, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/chat-page.scss";
import "../styles/chat-modal.scss";

// 하드코딩된 채팅 데이터
const mockChatData = [
  {
    id: 1,
    sender: "잡일 등록자",
    message:
      "수락자 님께서 해주시면 좋을 것 같아요. 시간은 제시해 드린대로 00시 00분 까지 00로 10 00빌딩 앞에서 뵈면 좋겠어요.",
  },
  { id: 2, sender: "잡일 수락자", message: "네 알겠습니다." },
  {
    id: 3,
    sender: "잡일 등록자",
    message: "최송한데 7000원에 하겠다는 분이 생겨서 없던 일로 하겠습니다.",
  },
  { id: 4, sender: "잡일 수락자", message: "얼.. 아쉽네요.. 수고요" },
];

const Chat = () => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setChatMessages(mockChatData);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newChatMessage = {
        id: chatMessages.length + 1,
        sender: "잡일 수락자",
        message: newMessage.trim(),
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
              className={`chat-message ${chat.sender === "잡일 수락자" ? "sent" : "received"}`}
            >
              <div className="message-content">
                <p>{chat.message}</p>
              </div>
              <span className="sender-name">{chat.sender}</span>
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
