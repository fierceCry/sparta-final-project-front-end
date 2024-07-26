import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/signup-page";
import LoginPage from "./pages/signin-page";
import MainPage from "./pages/main-page";
import RegisterJob from "./pages/job-create-page";
import UserInfoPage from "./pages/users-page";
import JobDetailPage from "./pages/job-detail-page";
import NoticePage from './pages/notice-detail-page';
import ReportPage from './pages/report-page';
import ChatListPage from './pages/chatlist-page';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/register-job" element={<RegisterJob />} />
      <Route path="/user" element={<UserInfoPage />} />
      <Route path="/job/:id" element={<JobDetailPage />} />
      <Route path="/notice/:id" element={<NoticePage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/chatlist" element={<ChatListPage />} />
    </Routes>
  </BrowserRouter>,
);

reportWebVitals();