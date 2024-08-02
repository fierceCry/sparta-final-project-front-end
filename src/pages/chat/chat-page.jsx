import React, { useState, useEffect, useRef } from "react";
import { Bell, User, Send } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client"; 
import "../../styles/chat/chat-page.scss";
import "../../styles/chat/chat-modal.scss";

const Chat = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const location = useLocation();
  const { receiverId, receiverName } = location.state || {};

  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isSending, setIsSending] = useState(false); 
  const chatContainerRef = useRef(null);

  const token = localStorage.getItem("accessToken");
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const socket = io(REACT_APP_API_URL, {
    auth: {
      token: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    console.log(receiverId);
    socket.emit("joinRoom", { receiverId });

    socket.on("receiveChat", (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]); 
    });

    socket.on("chatLog", (logs) => {
      console.log(logs);
      setChatMessages(logs);
    });
    
    socket.on("chatUpdated", (updatedChat) => {
      setChatMessages((prevMessages) => 
        prevMessages.map(chat => chat.id === updatedChat.id ? updatedChat : chat) 
      );
    });

    socket.on("chatDeleted", ({ chatId }) => {
      setChatMessages((prevMessages) => 
        prevMessages.filter(chat => chat.id !== chatId) 
      );
    });

    return () => {
      socket.off("receiveChat");
      socket.off("chatLog");
      socket.off("chatUpdated");
      socket.off("chatDeleted");
    };
  }, [id, receiverId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    console.log(id);
    if (newMessage.trim() && !isSending) {
      const newChatMessage = {
        receiverId, 
        content: newMessage.trim(),
        chatRoomId: parseInt(id), 
      };

      setIsSending(true);
      setNewMessage("");

      socket.emit("sendChat", newChatMessage);

      setTimeout(() => {
        setIsSending(false);
      }, 100); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      handleSendMessage();
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
        <div className="chat-container" ref={chatContainerRef}>
          {chatMessages.map((chat, index) => (
            <div
              key={chat.chatId || index}
              className={`chat-message ${chat.senderId === receiverId ? "received" : "sent"}`}
            >
              <div className="message-content">
                <span className="sender-name">
                  {chat.senderName && chat.senderName.name ? chat.senderName.name : "알 수 없는 사용자"}:                
                </span>
                <p>{chat.content}</p>
              </div>
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
            onKeyDown={handleKeyDown}
          />
          <button className="send-button" onClick={handleSendMessage} disabled={isSending}>
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
