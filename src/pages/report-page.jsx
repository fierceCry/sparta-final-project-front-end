import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Send, User } from "lucide-react";
import "../styles/report-page.scss";
import { ReportReason } from "../components/report-enum";

const ReportPage = () => {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("신고 제출:", { email, reason, details });
    navigate("/main");
  };

  const handleUserIconClick = () => {
    navigate("/user");
  };

  const handleMainClick = () => {
    navigate("/main");
  };
  return (
    <div className="report-page">
      <header className="report-page__header">
        <div className="report-page__header-left">
          <Link to="/main" className="report-page__back-button">
            <ChevronLeft />
          </Link>
          <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
            JOB일
          </h1>
        </div>
        <div className="report-page__header-right">
          <Bell />
          <Send />
          <User onClick={handleUserIconClick} style={{ cursor: "pointer" }} />
        </div>
      </header>
      <main className="report-page__main">
        <form className="report-page__form" onSubmit={handleSubmit}>
          <div className="report-page__form-group">
            <label htmlFor="email">신고 대상자 이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="신고할 사용자의 이메일을 입력하세요"
              required
            />
          </div>
          <div className="report-page__form-group">
            <label htmlFor="reason">신고 사유</label>
            <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required>
              <option value="">신고 사유를 선택하세요</option>
              {Object.entries(ReportReason).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="report-page__form-group">
            <label htmlFor="details">상세 설명</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="신고 사유를 자세히 설명해주세요"
              required
            ></textarea>
          </div>
          <button type="submit" className="report-page__submit-button">
            신고하기
          </button>
        </form>
      </main>
    </div>
  );
};

export default ReportPage;
