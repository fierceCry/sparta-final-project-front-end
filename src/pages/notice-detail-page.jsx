import React from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Send, User, ChevronLeft } from "lucide-react";
import '../styles/notice-detail-page.scss';

const NoticePage = () => {
  // const { id } = useParams();
  const navigate = useNavigate();

  // 하드코딩된 공지사항 데이터
  const notices = {
    id: 1,
    title: "시스템 점검 안내",
    date: "2024-07-26",
    content:
      "안녕하세요. JOB일 서비스 이용에 불편을 드려 죄송합니다. 시스템 안정화를 위한 점검이 진행될 예정입니다. 점검 시간 동안 서비스 이용이 제한되오니 양해 부탁드립니다.",
  };

  if (!notices) {
    return <div>공지사항을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="notice-detail-page">
      <header>
        <div className="header-left">
          <Link to="/main" className="back-button">
            <ChevronLeft />
          </Link>
          <h1>공지사항</h1>
        </div>
        <div className="header-icons">
          <Bell onClick={() => navigate("/notifications")} />
          <Send onClick={() => navigate("/messages")} />
          <User onClick={() => navigate("/user")} />
        </div>
      </header>
      <main>
        <article className="notice-card">
          <h2>{notices.title}</h2>
          <p className="notice-date">{notices.date}</p>
          <div className="notice-content">{notices.content}</div>
        </article>
      </main>
    </div>
  );
};

export default NoticePage;