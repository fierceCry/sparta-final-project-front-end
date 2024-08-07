import React, { useEffect, useState, useCallback } from "react";
import { Bell, Send, User, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/users/users-page.scss";
import { fetchUserInfo, updateUserInfo, logoutUser, quitUser } from '../../services/users';

const UserInfoPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const loadUserInfo = useCallback(async () => {
    try {
      const data = await fetchUserInfo(navigate);
      setUserInfo(data);
      setName(data.name);
    } catch (err) {
      setError(err.message);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  const handleMainClick = () => {
    navigate("/main");
  };

  const handlePersonalInfoChange = async () => {
    try {
      await updateUserInfo({ name, currentPasswordCheck: password, newPassword: confirmPassword }, navigate);
      alert("개인정보가 변경되었습니다.");
      setIsModalOpen(false);
      loadUserInfo();
    } catch (err) {
      alert(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser(navigate);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuit = async () => {
    try {
      await quitUser(navigate);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userInfo) {
    return <div>로딩 중...</div>;
  }

  const handleWithdraw = () => {
    navigate("/user-applications");
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
          <Bell onClick={() => navigate("/notifications")} />
          <Send onClick={() => navigate("/chatlist")} />
          <User onClick={() => navigate("/user")} />
        </div>
      </header>
      <main>
        <h2 className="page-title">사용자 정보 확인 페이지</h2>
        <div className="user-info-card">
          <div className="image-container">
            <img
              src={userInfo.imgUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTARPwb9kB_IbmVoCUE449kJhbusqQO0t1RPg&s"}
              alt="User"
              className="user-image"
            />
          </div>
          <div className="info-row">
            <span className="label">이름:</span>
            <span className="value">{userInfo.name}</span>
          </div>
          <div className="info-row">
            <span className="label">이메일:</span>
            <span className="value">{userInfo.email}</span>
          </div>
          <div className="button-group">
            <button className="outline-button" onClick={handleWithdraw}>
              내가 지원한 목록
            </button>
            <button className="outline-button" onClick={() => setIsModalOpen(true)}>
              개인정보 변경
            </button>
            <button className="outline-button" onClick={handleLogout}>
              로그아웃
            </button>
            <button className="outline-button" onClick={handleQuit}>
              회원탈퇴
            </button>
          </div>
        </div>
      </main>

      {/* 모달 구현 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>개인정보 변경</h2>
            <label>
              이름
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              기존 비밀번호
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              새로운 비밀번호
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <div className="modal-buttons">
              <button onClick={handlePersonalInfoChange}>확인</button>
              <button onClick={() => setIsModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoPage;
