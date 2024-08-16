import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../styles/jobs/job-create-page.scss";
import { refreshAccessToken } from '../../services/auth.service';
import { data } from '../../mock-data/job-address';

const RegisterJob = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [jobContent, setJobContent] = useState(""); 
  const [jobPrice, setJobPrice] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedGugun, setSelectedGugun] = useState("");
  const [selectedEupmyeondong, setSelectedEupmyeondong] = useState("");
  const [jobImage, setJobImage] = useState("");
  const [error, setError] = useState(null);
  const [gugunOptions, setGugunOptions] = useState([]);
  const [eupmyeondongOptions, setEupmyeondongOptions] = useState([]);

  useEffect(() => {
    if (selectedSido) {
      const gugunList = [...new Set(data
        .filter(item => item.시도명 === selectedSido && item.시군구명)
        .map(item => item.시군구명)
      )];
      setGugunOptions(gugunList);
      setSelectedGugun("");
      setSelectedEupmyeondong("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSido]);

  useEffect(() => {
    if (selectedGugun) {
      const eupmyeondongList = data
        .filter(item => item.시도명 === selectedSido && item.시군구명 === selectedGugun)
        .map(item => item.읍면동명)
        .filter(Boolean); // 읍면동명이 비어있지 않은 항목만 필터링
      setEupmyeondongOptions(eupmyeondongList);
      setSelectedEupmyeondong("");
    }
  }, [selectedGugun, selectedSido]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      title: jobTitle,
      content: jobContent, 
      price: Number(jobPrice),
      category: jobCategory, 
      address: `${selectedSido} ${selectedGugun} ${selectedEupmyeondong}`,
      photoUrl: jobImage 
    };
    
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/jobs`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/main");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newToken = await refreshAccessToken(navigate);
        if (newToken) {
          handleSubmit(e);
        }
      } else {
        setError("잡일 등록에 실패했습니다.");
      }
    }
  };

  return (
    <div className="register-job-page">
      <header>
        <Link to="/main" className="back-button">
          <ChevronLeft />
        </Link>
        <h1 onClick={() => navigate("/main")} style={{ cursor: "pointer" }}>
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
              <option value="사무직">사무직</option>
              <option value="현장직">현장직</option>
              <option value="서비스직">서비스직</option>
              <option value="기술직">기술직</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sido">시/도</label>
            <select
              id="sido"
              value={selectedSido}
              onChange={(e) => setSelectedSido(e.target.value)}
              required
            >
              <option value="">선택하세요</option>
              {[...new Set(data.map(item => item.시도명))].map((sido) => (
                <option key={sido} value={sido}>
                  {sido}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="gugun">구/군</label>
            <select
              id="gugun"
              value={selectedGugun}
              onChange={(e) => setSelectedGugun(e.target.value)}
              required
              disabled={!selectedSido}
            >
              <option value="">선택하세요</option>
              {gugunOptions.map((gugun) => (
                <option key={gugun} value={gugun}>
                  {gugun}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="eupmyeondong">읍/면/동</label>
            <select
              id="eupmyeondong"
              value={selectedEupmyeondong}
              onChange={(e) => setSelectedEupmyeondong(e.target.value)}
              required
              disabled={!selectedGugun}
            >
              <option value="">선택하세요</option>
              {eupmyeondongOptions.map((eupmyeondong) => (
                <option key={eupmyeondong} value={eupmyeondong}>
                  {eupmyeondong}
                </option>
              ))}
            </select>
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
