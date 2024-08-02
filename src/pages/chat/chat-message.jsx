import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";

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

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    // 클릭 이벤트 리스너 추가
    document.addEventListener("click", handleClickOutside);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

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

export default ChatMessage;
