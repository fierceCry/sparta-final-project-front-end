import React, { useEffect, useState } from "react";
import { Bell, Send, User, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/users-page.scss";

const UserInfoPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data);
      setEmail(response.data.email); // 초기 이메일 설정
      setName(response.data.name); // 초기 이름 설정
    } catch (err) {
      setError("사용자 정보를 가져오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchUserInfo(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
  }, []);

  const handleUserIconClick = () => {
    navigate("/user");
  };

  const handleMainClick = () => {
    navigate("/main");
  };

  const handlePersonalInfoChange = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다."); // 비밀번호 불일치 경고
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/v1/users/me`, {
        name, // 이름 추가
        email,
        newPassword: password,
        currentPasswordCheck: confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("개인정보가 변경되었습니다.");
      setIsModalOpen(false);
      fetchUserInfo(); // 사용자 정보 다시 가져오기
    } catch (err) {
      console.log(err.response.data.message)
      // setError("개인정보 변경에 실패했습니다.");
      if(err.response.data.message === '이메일이 이미 존재합니다.'){
        alert('이메일이 이미 존재합니다.')
      }
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('refreshToken');
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/v1/auth/sign-out`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate("/sign-in");
    } catch (err) {
      setError("로그아웃에 실패했습니다.");
      console.error(err);
    }
  };

  const handleQuit = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/quit`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate("/login");
    } catch (err) {
      setError("로그아웃에 실패했습니다.");
      console.error(err);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userInfo) {
    return <div>로딩 중...</div>;
  }

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
              이름:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              이메일:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              비밀번호:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              비밀번호 확인:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <div className="modal-buttons">
              <button onClick={() => setIsModalOpen(false)}>취소</button>
              <button onClick={handlePersonalInfoChange}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoPage;
