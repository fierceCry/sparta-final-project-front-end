import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bell, Send, User, ChevronLeft } from "lucide-react";
import axios from 'axios';
import "../styles/notice-detail-page.scss";

const NoticePage = () => {
  const { id } = useParams(); // URL에서 ID 가져오기
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/notices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Notice Response:", response.data);
        
        setNotice({
          id: response.data.data.id,
          title: response.data.data.title,
          date: response.data.data.createdAt,
          content: response.data.data.description,
          imageUrl: response.data.data.imageUrl,
        });
      } catch (err) {
        setError("공지사항을 가져오는 데 실패했습니다.");
      }
    };

    fetchNoticeDetail();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!notice) {
    return <div>로딩 중...</div>;
  }

  const handleMainClick = () => {
    navigate("/main");
  };

  return (
    <div className="notice-detail-page">
      <header>
        <div className="header-left">
          <Link to="/main" className="back-button">
            <ChevronLeft />
          </Link>
          <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
            JOB일
          </h1>
        </div>
        <div className="header-icons">
          <Bell onClick={() => navigate("/notifications")} />
          <Send onClick={() => navigate("/messages")} />
          <User onClick={() => navigate("/user")} />
        </div>
      </header>
      <main>
        <article className="notice-card">
          <h2>{notice.title}</h2>
          <p className="notice-date">{new Date(notice.date).toLocaleDateString()}</p>
          {notice.imageUrl && <img src={notice.imageUrl} alt={notice.title} className="notice-image" />}
          <div className="notice-content">{notice.content}</div>
        </article>
      </main>
    </div>
  );
};

export default NoticePage;
