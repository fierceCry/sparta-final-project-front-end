import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import {
  sendVerificationCode,
  signupUser,
  validateEmail,
  validatePassword,
} from "../services/sign-up-page";
import "../styles/signup-page.scss";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [savedVerificationCode, setSavedVerificationCode] = useState("");

  const handleVerificationCode = async () => {
    if (!validateEmail(email)) {
      alert("유효한 이메일 주소를 입력하세요.");
      return;
    }

    try {
      const message = await sendVerificationCode(email);
      alert(message);
      setError("");
      setIsModalOpen(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleModalSubmit = (event) => {
    event.preventDefault();
    const code = verificationCode.join("");
    setSavedVerificationCode(code); 
    console.log("입력한 인증 코드:", code);
    setIsModalOpen(false);
  };

  const handleSignup = async (event) => {
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

    try {
      await signupUser(userData);
      alert('회원가입이 완료되었습니다.');
      setError("");
      navigate("/sign-in");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCodeChange = (index, value) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < verificationCode.length - 1) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }

    if (!value && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  return (
    <div className="container">
      <h2 className="title">회원가입</h2>
      <form className="form" onSubmit={handleSignup}>
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
            <button type="button" className="verify-button" onClick={handleVerificationCode}>
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
            개인 회원가입
          </button>
        </div>

        <div className="button-group">
          <button type="button" className="button">
            업장 회원가입
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>인증 코드 입력</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="code-input">
                {verificationCode.map((code, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={code}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="verification-input"
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

export default SignupPage;
