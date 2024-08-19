import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import btnKakao from "../../data/btn_kakao.svg";
// import btnNaver from "../../data/btn_naver.svg";
import btnGoogle from "../../data/btn_google.svg";
import {
  signin,
  validateEmail,
  validatePassword,
  // handleKakaoLogin,
  // handleNaverLogin,
  handleGoogleLogin,
} from "../../services/sign-in-page";
import "../../styles/auth/signin-page.scss";
import axios from "axios"; // axios를 사용하여 API 호출

const Modal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isTempPasswordSent, setIsTempPasswordSent] = useState(false);

  if (!isOpen) return null;

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSendTempPassword = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/auth/email/temp-pw`, { email });
      setSuccess("임시 비밀번호가 이메일로 전송되었습니다.");
      setError("");
      setIsTempPasswordSent(true);
    } catch (err) {
      setError("이메일 전송에 실패했습니다. 다시 시도해주세요.");
      setSuccess("");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/auth/find-pw`, {
        email,
        name,
        tempPassword: newPassword,
      });
      setSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setError("");
      onClose();
    } catch (err) {
      if(err.response.data.message === '가입되지 않은 계정입니다.'){
        setError("가입되지 않은 계정입니다.");
      }
      setSuccess("");
    }
  };

  const handleClose = () => {
    // 상태 초기화
    setEmail("");
    setName("");
    setNewPassword("");
    setError("");
    setSuccess("");
    setIsTempPasswordSent(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!isTempPasswordSent) {
        handleSendTempPassword();
      } else {
        handleResetPassword();
      }
    }
  };

  return (
    <div className="modal-overlay" onKeyDown={handleKeyDown}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>비밀번호 찾기</h2>
          <span className="modal-close-button" onClick={handleClose}>
            X
          </span>
        </div>

        {success && <p className="modal-success">{success}</p>}
        {error && <p className="modal-error">{error}</p>}

        <div className="modal-input-group">
          <label htmlFor="email" className="modal-label">
            이메일
          </label>
          <input
            id="email"
            type="email"
            placeholder="이메일 주소"
            className="modal-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown} // 엔터키 이벤트 추가
          />
          <button className="modal-send-button" onClick={handleSendTempPassword}>
            임시 비밀번호 전송
          </button>
        </div>

        {isTempPasswordSent && (
          <>
            <div className="modal-input-group">
              <label htmlFor="name" className="modal-label">
                이름
              </label>
              <input
                id="name"
                type="text"
                placeholder="이름 입력"
                className="modal-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown} // 엔터키 이벤트 추가
              />
            </div>
            <div className="modal-input-group">
              <label htmlFor="new-password" className="modal-label">
                임시 비밀번호
              </label>
              <input
                id="new-password"
                type="password"
                placeholder="새 비밀번호 입력"
                className="modal-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown} // 엔터키 이벤트 추가
              />
            </div>

            <div className="modal-buttons">
              <button className="modal-send-button" onClick={handleResetPassword}>
                비밀번호 변경
              </button>
              <button onClick={handleClose} className="modal-send-button">
                취소
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  const handleClickSignUp = () => {
    navigate("/sign-up");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("유효한 이메일 주소를 입력하세요.");
      return;
    }

    if (!validatePassword(password)) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    setError("");

    try {
      await signin(email, password);
      navigate("/main");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <h1 className="login-page__title">JOB일</h1>
        <div className="login-page__form-container">
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-form__input-group">
              <label htmlFor="email" className="login-form__label">
                이메일 주소
              </label>
              <div className="login-form__input-wrapper">
                <Mail className="login-form__input-icon" aria-hidden="true" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="login-form__input"
                  placeholder="예) kream@kream.co.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="login-form__input-group">
              <label htmlFor="password" className="login-form__label">
                비밀번호
              </label>
              <div className="login-form__input-wrapper">
                <Lock className="login-form__input-icon" aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="login-form__input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-form__password-toggle"
                >
                  {showPassword ? (
                    <EyeOff className="login-form__password-toggle-icon" aria-hidden="true" />
                  ) : (
                    <Eye className="login-form__password-toggle-icon" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="login-form__error">{error}</p>}

            <div className="login-form__help-buttons">
              {/* <button type="button" className="login-form__help-button">
                아이디 찾기
              </button> */}
              <button
                type="button"
                className="login-form__help-button"
                onClick={() => setIsModalOpen(true)}
              >
                비밀번호 찾기
              </button>
            </div>

            <div className="login-form__social-login">
              {/* <button
                type="button"
                onClick={handleKakaoLogin}
                className="login-form__social-button"
              >
                <img src={btnKakao} alt="카카오 로그인 버튼" />
              </button>
              <button
                type="button"
                onClick={handleNaverLogin}
                className="login-form__social-button"
              >
                <img src={btnNaver} alt="네이버 로그인 버튼" />
              </button> */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="login-form__social-button"
              >
                <img src={btnGoogle} alt="구글 로그인 버튼" />
              </button>
            </div>

            <button type="submit" className="login-form__submit-btn">
              로그인
            </button>
          </form>

          <button type="button" className="login-page__signup-btn" onClick={handleClickSignUp}>
            회원가입
          </button>
        </div>
      </div>

      {/* 모달 추가 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LoginPage;
