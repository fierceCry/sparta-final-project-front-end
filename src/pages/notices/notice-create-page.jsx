import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../styles/notices/notice-create-page.scss"; // 스타일 경로 수정
import { refreshAccessToken } from '../../services/auth.service'; // 오타 수정

const RegisterNotice = () => {
  const navigate = useNavigate();
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState(""); 
  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL 상태 초기화
  const [error, setError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const noticeData = {
      title: noticeTitle,
      description: noticeContent, 
      imageUrl: imageUrl, // 이미지 URL 추가
    };
    
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/notices`, noticeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      alert('공지사항 등록 성공했습니다.')
      navigate("/main");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newToken = await refreshAccessToken(navigate);
        if (newToken) {
          handleSubmit(e);
        }
      } else if(err.response.data.message === '관리자 권한이 필요합니다.'){
        alert('관리자 권한이 필요합니다.')
      } else {
        setError("공지사항 등록에 실패했습니다.");
      }
    }
  };

  const handleMainClick = () => {
    navigate("/main");
  };

  return (
    <div className="register-notice-page">
      <header>
        <Link to="/main" className="back-button">
          <ChevronLeft />
        </Link>
        <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
          공지사항
        </h1>
      </header>
      <main>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="noticeTitle">제목</label>
            <input
              type="text"
              id="noticeTitle"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noticeContent">내용</label>
            <textarea
              id="noticeContent"
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="imageUpload">이미지 URL</label>
            <input
              type="text"
              id="imageUpload"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)} // URL 입력 시 상태 업데이트
              placeholder="이미지 URL을 입력하세요"
              required
            />
          </div>
          {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />}
          <button type="submit" className="submit-button">
            등록하기
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterNotice;
