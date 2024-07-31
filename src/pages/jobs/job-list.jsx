import React, { useEffect, useState } from "react";
import { ChevronLeft, Bell, Send, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { refreshAccessToken } from "../../services/auth.service";
import "../../styles/jobs/job-list.scss";

const JobApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/sign-in");
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/job-matching/apply`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        
        // 응답 데이터에서 Matching 배열을 가져옵니다.
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
    console.log(applicationId)
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

      console.log(`Application ${applicationId} withdrawn`);
    } catch (err) {
      setError("삭제하는 데 실패했습니다.");
      console.error(err);
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`); // 잡일 상세 조회 페이지로 이동
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
            {applications.length > 0 ? (
              applications.map((application) => {
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

          <div className="load-more">
            <button>더보기</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobApplications;
