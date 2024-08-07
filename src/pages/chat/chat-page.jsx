import React, { useState, useEffect, useRef } from "react";
import { Bell, User, Send } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext"; // useSocket 훅 임포트
import "../../styles/chat/chat-page.scss";
import "../../styles/chat/chat-modal.scss";

const Chat = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const location = useLocation();
  const { receiverId } = location.state || {};

  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isSending, setIsSending] = useState(false); 
  const chatContainerRef = useRef(null);

  const socket = useSocket(); // 소켓 인스턴스 가져오기

  useEffect(() => {
    if (!socket) {
      console.error("소켓이 연결되지 않았습니다.");
      return;
    }

    console.log("소켓 연결됨:", socket);

    // 방에 참여
    socket.emit("joinRoom", { receiverId });

    // 수신된 메시지 처리
    socket.on("receiveChat", (message) => {
      console.log("수신된 메시지:", message);
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    // 채팅 로그 처리
    socket.on("chatLog", (logs) => {
      console.log("채팅 로그:", logs);
      setChatMessages(logs);
    });

    // 업데이트된 채팅 처리
    socket.on("chatUpdated", (updatedChat) => {
      console.log("업데이트된 채팅:", updatedChat);
      setChatMessages((prevMessages) =>
        prevMessages.map(chat => chat.id === updatedChat.id ? updatedChat : chat)
      );
    });

    // 삭제된 채팅 처리
    socket.on("chatDeleted", ({ chatId }) => {
      console.log("삭제된 채팅 ID:", chatId);
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
  }, [socket, receiverId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && !isSending) {
      const newChatMessage = {
        receiverId, 
        content: newMessage.trim(),
        chatRoomId: parseInt(id),
        senderId: socket.id, // senderId 추가
      };

      setIsSending(true);
      setNewMessage("");
      console.log("보내는 메시지:", newChatMessage);
      
      // 메시지를 로컬 상태에 추가
      setChatMessages((prevMessages) => [...prevMessages, newChatMessage]);

      // 메시지를 소켓으로 전송
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
              key={chat.chatId || `temp-${index}`} // 고유한 키 값 사용
              className={`chat-message ${chat.senderId === receiverId ? "received" : "sent"}`}
            >
              <div className="message-content">
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
