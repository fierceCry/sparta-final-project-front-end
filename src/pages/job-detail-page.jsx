import React, { useState } from 'react';
import { Bell, Send, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/job-detail-page.scss';

const JobDetailPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const images = [
    "https://d12zq4w4guyljn.cloudfront.net/750_750_20240322093620435_photo_92730ef4d1fd.jpg",
    "https://orale.co.kr/wp-content/uploads/2023/08/%EA%B4%91%EA%B5%90-%EC%9B%90%EC%A1%B0-%EC%96%91%ED%8F%89%ED%95%B4%EC%9E%A5%EA%B5%AD7-1024x768.jpeg",
    "https://static.inews24.com/v1/1f6e48ec0b59a4.jpg",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleReport = () => {
    navigate('/report');
  };

  return (
    <div className="job-detail-page">
      <header>
        <div className="header-left">
          <Link to="/main" className="back-button">
            <ChevronLeft />
          </Link>
          <h1>JOB일</h1>
        </div>
        <div className="header-right">
          <Bell />
          <Send />
          <User />
        </div>
      </header>
      <main>
        <div className="job-card">
          <div className="job-content">
            <div className="job-image-container">
              <button className="image-nav-button prev" onClick={prevImage}>
                <ChevronLeft />
              </button>
              <img src={images[currentImageIndex]} alt={`Job location ${currentImageIndex + 1}`} className="job-image" />
              <button className="image-nav-button next" onClick={nextImage}>
                <ChevronRight />
              </button>
              <div className="image-pagination">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
            <div className="job-info">
              <h2>성실히 일할 직원 모집합니다</h2>
              <div className="job-details">
                <div className="detail-row">
                  <span className="label">위치:</span>
                  <span className="value">평양시 평양냉면해장국</span>
                </div>
                <div className="detail-row">
                  <span className="label">보수:</span>
                  <span className="value">999,999,999,999원(시급)</span>
                </div>
                <div className="detail-row">
                  <span className="label">시간:</span>
                  <span className="value">19:00-02:00</span>
                </div>
                <div className="detail-row">
                  <span className="label">업무:</span>
                  <span className="value">설거지, 홀 청소, 다음날 물수건 준비 등</span>
                </div>
              </div>
              <div className="map-container">
                <img src="https://example.com/path-to-map-image.jpg" alt="Job location map" className="map-image" />
              </div>
            </div>
          </div>
          <div className="button-group">
            <button className="apply-button">지원하기</button>
            <button className="save-button" onClick={handleReport}>신고하기</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailPage;