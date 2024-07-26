import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/job-create-page.scss";

const RegisterJob = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobPrice, setJobPrice] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobLocation, setJobLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 잡일 등록 로직 구현
    console.log("잡일 등록:", { jobTitle, jobDescription, jobPrice, jobCategory, jobLocation });
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
            <label htmlFor="jobDescription">설명</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
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
            <label htmlFor="jobLocation">위치</label>
            <input
              type="text"
              id="jobLocation"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              required
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
