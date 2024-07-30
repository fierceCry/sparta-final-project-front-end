import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import btnKakao from "../../data/btn_kakao.svg";
import btnNaver from "../../data/btn_naver.svg";
import btnGoogle from "../../data/btn_google.svg";
import {
  signin,
  validateEmail,
  validatePassword,
  handleKakaoLogin,
  handleNaverLogin,
  handleGoogleLogin,
} from "../../services/sign-in-page";
import "../../styles/auth/signin-page.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      console.error(error);
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
              <button type="button" className="login-form__help-button">
                아이디 찾기
              </button>
              <button type="button" className="login-form__help-button">
                비밀번호 찾기
              </button>
            </div>

            <div className="login-form__social-login">
              <button
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
              </button>
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
    </div>
  );
};

export default LoginPage;
