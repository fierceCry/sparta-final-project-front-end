import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../styles/jobs/job-create-page.scss";
import { refreshAccessToken } from '../../services/auth.serivce'; 

const RegisterJob = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [jobContent, setJobContent] = useState(""); 
  const [jobPrice, setJobPrice] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobAddress, setJobAddress] = useState("");
  const [jobImage, setJobImage] = useState("");
  const [error, setError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      title: jobTitle,
      content: jobContent, 
      price: Number(jobPrice),
      category: jobCategory, 
      address: jobAddress,
      photoUrl: jobImage 
    };
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/jobs`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("잡일 등록 성공:", response.data);
      navigate("/main");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newToken = await refreshAccessToken(navigate);
        if (newToken) {
          handleSubmit(e);
        }
      } else {
        setError("잡일 등록에 실패했습니다.");
        console.error(err);
      }
    }
  };

  const handleMainClick = () => {
    navigate("/main");
  };

  return (
    <div className="register-job-page">
      <header>
        <Link to="/main" className="back-button">
          <ChevronLeft />
        </Link>
        <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
          JOB일
        </h1>
      </header>
      <main>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jobTitle">제목</label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobContent">내용</label>
            <textarea
              id="jobContent"
              value={jobContent}
              onChange={(e) => setJobContent(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobPrice">가격</label>
            <input
              type="number"
              id="jobPrice"
              value={jobPrice}
              onChange={(e) => setJobPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobCategory">카테고리</label>
            <select
              id="jobCategory"
              value={jobCategory}
              onChange={(e) => setJobCategory(e.target.value)}
              required
            >
              <option value="">선택하세요</option>
              <option value="design">디자인</option>
              <option value="development">개발</option>
              <option value="marketing">마케팅</option>
              <option value="writing">글쓰기</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="jobAddress">주소</label>
            <input
              type="text"
              id="jobAddress"
              value={jobAddress}
              onChange={(e) => setJobAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobImage">이미지 URL</label>
            <input
              type="text"
              id="jobImage"
              value={jobImage}
              onChange={(e) => setJobImage(e.target.value)}
              placeholder="이미지 URL을 입력하세요"
            />
          </div>
          <button type="submit" className="submit-button">
            등록하기
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterJob;
