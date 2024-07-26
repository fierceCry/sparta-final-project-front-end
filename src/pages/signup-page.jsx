import React from "react";
import { Mail, Lock, User } from "lucide-react";
import "../styles/signup-page.scss";

const SignupPage = () => {
  return (
    <div className="container">
      <h2 className="title">회원가입</h2>
      <form className="form" action="#" method="POST">
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
            />
            <button type="button" className="verify-button">
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
            />
          </div>
        </div>

        <div className="form-group">
          <div className="label-wrapper">
            <label htmlFor="nickname" className="label">
              닉네임
            </label>
            <User className="icon" size={16} />
          </div>
          <div className="input-wrapper">
            <input
              id="nickname"
              name="nickname"
              type="text"
              autoComplete="nickname"
              required
              className="input"
              placeholder="예) 홍길동"
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
    </div>
  );
};

export default SignupPage;
