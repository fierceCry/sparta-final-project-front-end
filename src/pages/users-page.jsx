import React from "react";
import { Bell, Send, User, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { users } from "../services/users-page";
import "../styles/users-page.scss";

const UserInfoPage = () => {
  const navigate = useNavigate();

  const handleUserIconClick = () => {
    navigate("/user");
  };

  const handleMainClick = () => {
    navigate("/main");
  };
  return (
    <div className="user-info-page">
      <header>
        <div className="header-left">
          <Link to="/main" className="back-button">
            <ChevronLeft />
          </Link>
          <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
            JOB일
          </h1>
        </div>
        <div className="header-right">
          <Bell />
          <Send />
          <User onClick={handleUserIconClick} style={{ cursor: "pointer" }} />
        </div>
      </header>
      <main>
        <h2 className="page-title">사용자 정보 확인 페이지</h2>
        <div className="user-info-card">
          <div className="image-container">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTARPwb9kB_IbmVoCUE449kJhbusqQO0t1RPg&s"
              alt="User"
              className="user-image"
            />
          </div>
          <div className="info-row">
            <span className="label">닉네임:</span>
            <span className="value">nickname</span>
          </div>
          <div className="info-row">
            <span className="label">이름:</span>
            <span className="value">홍길동</span>
          </div>
          <div className="info-row">
            <span className="label">이메일:</span>
            <span className="value">example@example.com</span>
          </div>
          <div className="button-group">
            <button className="outline-button" onClick={users.handlePasswordChange}>
              비밀번호 변경하기
            </button>
            <button className="outline-button" onClick={users.handlePersonalInfoChange}>
              개인정보 변경하기
            </button>
            <button className="outline-button" onClick={users.handlePersonalInfoLogOut}>
              로그 아웃
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserInfoPage;
