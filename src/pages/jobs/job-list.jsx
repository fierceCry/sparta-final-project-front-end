import React, { useEffect, useState } from "react";
import { ChevronLeft, Bell, Send, User, ChevronRight } from "lucide-react"; // ChevronRight 추가
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { refreshAccessToken } from "../../services/auth.service";
import "../../styles/jobs/job-list.scss";

const JobApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  
  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 6; // 페이지당 보여줄 지원 목록 수

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/sign-in");
      return;
    }

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/job-matching/apply`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        setApplications(response.data.Matching || []); 
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newToken = await refreshAccessToken(navigate);
          if (newToken) {
            fetchApplications();
          }
        } else {
          setError("지원 목록을 가져오는 데 실패했습니다.");
        }
      }
    };

    fetchApplications();
  }, [navigate]);

  const handleWithdraw = async (applicationId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/job-matching/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // 삭제 후, 목록에서 해당 신청 제거
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application.id !== applicationId)
      );

    } catch (err) {
      setError("삭제하는 데 실패했습니다.");
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`); // 잡일 상세 조회 페이지로 이동
  };

  // 현재 페이지에 맞는 지원 목록을 가져오는 함수
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);

  // 페이지 변경 핸들러
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(applications.length / applicationsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="job-matching">
      <header>
        <Link to="/main" className="report-page__back-button">
          <ChevronLeft />
        </Link>
        <h1 onClick={() => navigate("/main")} style={{ cursor: "pointer" }}>
          JOB일
        </h1>
        <div className="header-icons">
          <input type="text" placeholder="JOB일 검색" className="search-input" />
          <Bell onClick={() => navigate("/notifications")} />
          <Send onClick={() => navigate("/chatlist")} />
          <User onClick={() => navigate("/user")} />
        </div>
      </header>

      <main>
        <div className="content-container">
          <h2>내가 지원한 목록</h2>
          {error && <p className="error-message">{error}</p>} 

          <div className="job-list">
            {currentApplications.length > 0 ? (
              currentApplications.map((application) => {
                const isExpired = application.matchedYn;
                const isMatched = application.rejectedYn;

                // 클래스 이름 결정
                let itemClass = '';
                if (isExpired) {
                  itemClass = 'matched'; // 초록색
                } else if (isMatched) {
                  itemClass = 'not-matched'; // 빨간색
                }

                return (
                  <div 
                    className={`job-item ${itemClass}`} 
                    key={application.id}
                    onClick={() => handleViewDetails(application.jobId)} // 잡일 상세 조회로 이동
                  >
                    <span>
                      잡일: {application.job.title}
                    </span>
                    <div className="status-icons">
                      <button onClick={(e) => { 
                        e.stopPropagation(); // 클릭 이벤트 전파 방지
                        handleWithdraw(application.id); 
                      }}>
                        삭제
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>지원한 잡일이 없습니다.</p> 
            )}
          </div>

          {/* 페이지네이션 - 화살표 버튼 */}
          {applications.length > applicationsPerPage && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                <ChevronLeft />
              </button>
              <span>{currentPage} / {Math.ceil(applications.length / applicationsPerPage)}</span>
              <button onClick={handleNextPage} disabled={currentPage === Math.ceil(applications.length / applicationsPerPage)}>
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobApplications;
