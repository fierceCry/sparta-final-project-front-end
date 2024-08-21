import React, { useState, useEffect } from "react";
import { Mail, Lock, User } from "lucide-react";
import {
  sendVerificationCode,
  signupUser,
  validateEmail,
  validatePassword,
} from "../../services/sign-up-page";
import {
  startTimer,
  handleVerificationCode,
  handleModalSubmit,
  handleSignup,
  handleCodeChange,
} from "../../services/sign-up-page"; 
import "../../styles/auth/signup-page.scss";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [savedVerificationCode, setSavedVerificationCode] = useState("");
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    if (isModalOpen) {
      const interval = startTimer(isModalOpen, timer, setTimer, setIsModalOpen);
      return () => clearInterval(interval);
    }
  }, [isModalOpen, timer]);

  const handleVerificationCodeClick = async () => {
    await handleVerificationCode(email, validateEmail, sendVerificationCode, setIsModalOpen, setTimer);
  };

  const handleModalSubmitClick = (event) => {
    event.preventDefault();
    handleModalSubmit(verificationCode, setSavedVerificationCode, setIsModalOpen);
  };

  const handleSignupClick = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      alert("유효한 이메일 주소를 입력하세요.");
      return;
    }

    if (!validatePassword(password)) {
      alert("비밀번호는 최소 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!name) {
      alert("이름을 입력하세요.");
      return;
    }

    const userData = {
      email,
      password,
      passwordCheck: passwordConfirm,
      name,
      verificationCode: parseInt(savedVerificationCode),
    };

    await handleSignup(userData, signupUser, navigate);
  };

  const handleCodePaste = (index, event) => {
    const pastedData = event.clipboardData.getData('text').replace(/\s/g, '');
    const newCode = [...verificationCode];

    for (let i = 0; i < pastedData.length && index + i < verificationCode.length; i++) {
      newCode[index + i] = pastedData.charAt(i);
    }

    setVerificationCode(newCode);
    const nextIndex = Math.min(index + pastedData.length, verificationCode.length - 1);
    document.getElementById(`code-input-${nextIndex}`).focus();
  };

  return (
    <div className="container">
      <h2 className="title">회원가입</h2>
      <form className="form" onSubmit={handleSignupClick}>
        <div className="form-group">
          <div className="label-wrapper">
            <label htmlFor="email" className="label">
              이메일 주소
            </label>
            <Mail className="icon" size={16} />
          </div>
          <div className="input-wrapper">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              placeholder="예) example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" className="verify-button" onClick={handleVerificationCodeClick}>
              인증코드 발송
            </button>
          </div>
        </div>

        <div className="form-group">
          <div className="label-wrapper">
            <label htmlFor="password" className="label">
              비밀번호
            </label>
            <Lock className="icon" size={16} />
          </div>
          <div className="input-wrapper">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="label-wrapper">
            <label htmlFor="password-confirm" className="label">
              비밀번호 확인
            </label>
            <Lock className="icon" size={16} />
          </div>
          <div className="input-wrapper">
            <input
              id="password-confirm"
              name="password-confirm"
              type="password"
              autoComplete="new-password"
              required
              className="input"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="label-wrapper">
            <label htmlFor="name" className="label">
              이름
            </label>
            <User className="icon" size={16} />
          </div>
          <div className="input-wrapper">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input"
              placeholder="예) 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="button">
            회원가입
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>인증 코드 입력</h2>
            <p>남은 시간: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p>
            <form onSubmit={handleModalSubmitClick}>
              <div className="code-input">
                {verificationCode.map((code, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    value={code}
                    onChange={(e) => handleCodeChange(index, e.target.value, verificationCode, setVerificationCode)}
                    onPaste={(e) => handleCodePaste(index, e)}
                    className="verification-input"
                    maxLength={1}
                  />
                ))}
              </div>
              <button type="submit">확인</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>닫기</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export {SignupPage};
