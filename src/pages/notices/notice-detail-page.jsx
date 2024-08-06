import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bell, Send, User, ChevronLeft } from "lucide-react";
import { fetchNoticeDetail, deleteNotice, updateNotice } from '../../services/notice';
import "../../styles/notices/notice-detail-page.scss";

const Modal = ({ isOpen, onClose, noticeData, onSubmit }) => {
  const [title, setTitle] = useState(noticeData.title);
  const [description, setDescription] = useState(noticeData.content);
  const [imageUrl, setImageUrl] = useState(noticeData.imageUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, imageUrl });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>공지사항 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>내용</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>이미지 URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-button">완료</button>
          <button type="button" onClick={onClose} className="close-button">닫기</button>
        </form>
      </div>
    </div>
  );
};

const NoticePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const noticeData = await fetchNoticeDetail(id, navigate);
        setNotice({
          id: noticeData.id,
          title: noticeData.title,
          date: noticeData.createdAt,
          content: noticeData.description,
          imageUrl: noticeData.imageUrl,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchNotice();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await deleteNotice(id);
      alert("공지사항이 삭제되었습니다.");
      navigate("/main");
    } catch (err) {
      setError("공지사항 삭제에 실패했습니다.");
    }
  };

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleUpdateNotice = async (updatedNotice) => {
    try {
      await updateNotice(id, updatedNotice);
      setNotice((prevNotice) => ({
        ...prevNotice,
        title: updatedNotice.title,
        content: updatedNotice.description,
        imageUrl: updatedNotice.imageUrl,
      }));
      alert("공지사항이 수정되었습니다.");
    } catch (err) {
      setError("공지사항 수정에 실패했습니다.");
    }
  };

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
          <Send onClick={() => navigate("/chatlist")} />
          <User onClick={() => navigate("/user")} />
        </div>
      </header>
      <main>
        <article className="notice-card">
          <h2>{notice.title}</h2>
          <p className="notice-date">{new Date(notice.date).toLocaleDateString()}</p>
          <div className="notice-content">{notice.content}</div>
          {notice.imageUrl && <img src={notice.imageUrl} alt={notice.title} className="notice-image" />}
          <div className="action-buttons">
            <button onClick={handleEdit} className="edit-button">수정</button>
            <button onClick={handleDelete} className="delete-button">삭제</button>
          </div>
        </article>
      </main>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        noticeData={notice} 
        onSubmit={handleUpdateNotice} 
      />
    </div>
  );
};

export default NoticePage;
