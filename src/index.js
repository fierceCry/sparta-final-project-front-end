import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/auth/signup-page";
import LoginPage from "./pages/auth/signin-page";
import MainPage from "./pages/main/main-page";
import RegisterJob from "./pages/jobs/job-create-page";
import UserInfoPage from "./pages/users/users-page";
import JobDetailPage from "./pages/jobs/job-detail-page";
import NoticePage from "./pages/notices/notice-detail-page";
import ReportPage from "./pages/reports/report-page";
import ChatListPage from "./pages/chat/chatlist-page";
import Chat from "./pages/chat/chat-page";
import Notifications from "./pages/notifications/notifications-page";
import JobMatching from './pages/jobs/job-matching'
import JobApplications from './pages/jobs/job-list'
import RegisterNotice from './pages/notices/notice-create-page';

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
      <Route path="/chat/:id" element={<Chat />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/job-matching" element={<JobMatching />} />
      <Route path="/user-applications" element={<JobApplications />} />
      <Route path="/create-notice" element={<RegisterNotice />} />
    </Routes>
  </BrowserRouter>,
);

reportWebVitals();
