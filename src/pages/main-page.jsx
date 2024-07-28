import React, { useState } from "react";
import { Bell, Send, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main-page.scss";

const MainPage = () => {
  const navigate = useNavigate();

  const allJobs = [
    { id: 1, title: "위대한 레오 M.오코너에게 듣는 독서", price: "12,000" },
    { id: 2, title: "글로벌 게스트하우스 에어비앤비 공동창업자", price: "500,000" },
    { id: 3, title: "지역주민 생시로운 오사카 여행", price: "90,000" },
    { id: 4, title: "도시락짜는 엄마 다이어리(먹기편)", price: "8,840" },
    { id: 5, title: "파우더룸장기 실습으로 곧 구매", price: "50,000" },
    { id: 6, title: "탄산수&샴페인잔 구매품", price: "50,000" },
    { id: 7, title: "새로운 프로젝트 아이디어 브레인스토밍", price: "100,000" },
    { id: 8, title: "온라인 마케팅 전략 수립", price: "300,000" },
    { id: 9, title: "웹사이트 리디자인 프로젝트", price: "1,000,000" },
  ];

  const allNotices = [
    {
      id: 1,
      title: "시스템 업데이트 안내",
      description:
        "7월 30일 02:00-04:00 동안 시스템 점검이 있을 예정입니다. 이용에 참고 부탁드립니다.",
    },
    {
      id: 2,
      title: "새로운 기능 추가",
      description:
        "이제 프로필 페이지에서 자신의 스킬을 더 자세히 소개할 수 있습니다. 많은 이용 바랍니다.",
    },
    {
      id: 3,
      title: "여름 이벤트 안내",
      description:
        "8월 한 달간 특별 이벤트를 진행합니다. 자세한 내용은 이벤트 페이지를 확인해주세요.",
    },
    {
      id: 4,
      title: "결제 시스템 개선",
      description:
        "더욱 안전하고 편리한 결제를 위해 결제 시스템을 개선하였습니다. 많은 이용 바랍니다.",
    },
  ];

  const [jobPage, setJobPage] = useState(1);
  const [noticePage, setNoticePage] = useState(1);
  const jobsPerPage = 6;
  const noticesPerPage = 2;

  const indexOfLastJob = jobPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = allJobs.slice(indexOfFirstJob, indexOfLastJob);

  const indexOfLastNotice = noticePage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = allNotices.slice(indexOfFirstNotice, indexOfLastNotice);

  const totalJobPages = Math.ceil(allJobs.length / jobsPerPage);
  const totalNoticePages = Math.ceil(allNotices.length / noticesPerPage);

  const handleUserIconClick = () => {
    navigate("/user");
  };

  const handleChatListClick = () => {
    navigate("/chatlist");
  };

  const handleMainClick = () => {
    navigate("/main");
  };

  return (
    <div className="main-page">
      <header>
        <h1 onClick={handleMainClick} style={{ cursor: "pointer" }}>
          JOB일
        </h1>{" "}
        <div className="header-icons">
          <input type="text" placeholder="JOB일 검색" className="search-input" />
          <Bell />
          <Send onClick={handleChatListClick} style={{ cursor: "pointer" }} />
          <User onClick={handleUserIconClick} style={{ cursor: "pointer" }} />
        </div>
      </header>

      <main>
        <div className="content-container">
          <div className="job-list">
            <div className="job-list-header">
              <h2>잡일 목록</h2>
              <Link to="/register-job" className="register-button">
                잡일 등록
              </Link>
            </div>
            <div className="alarm-grid">
              {currentJobs.map((job) => (
                <Link to={`/job/${job.id}`} key={job.id} className="alarm-card">
                  <div className="card-content">
                    <h3>{job.title}</h3>
                    <p>시작 {job.price}원</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="pagination">
              <button
                onClick={() => setJobPage((prev) => Math.max(prev - 1, 1))}
                disabled={jobPage === 1}
              >
                <ChevronLeft />
              </button>
              <span>
                {jobPage} / {totalJobPages}
              </span>
              <button
                onClick={() => setJobPage((prev) => Math.min(prev + 1, totalJobPages))}
                disabled={jobPage === totalJobPages}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="notice-board">
            <h2>공지사항</h2>
            {currentNotices.map((notice) => (
              <Link to={`/notice/${notice.id}`} key={notice.id} className="notice-content">
                <h3>{notice.title}</h3>
                <p>{notice.description}</p>
              </Link>
            ))}
            <div className="pagination">
              <button
                onClick={() => setNoticePage((prev) => Math.max(prev - 1, 1))}
                disabled={noticePage === 1}
              >
                <ChevronLeft />
              </button>
              <span>
                {noticePage} / {totalNoticePages}
              </span>
              <button
                onClick={() => setNoticePage((prev) => Math.min(prev + 1, totalNoticePages))}
                disabled={noticePage === totalNoticePages}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
