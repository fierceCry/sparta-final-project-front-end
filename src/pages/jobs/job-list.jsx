import React, { useEffect, useState } from "react";
import { ChevronLeft, Bell, Send, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { refreshAccessToken } from "../../services/auth.serivce";
import "../../styles/jobs/job-matching.scss";

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

  const handleWithdraw = (applicationId) => {
    console.log(`Application ${applicationId} withdrawn`);
    // navigate("/user-applications");
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
              applications.map((application) => (
                <div className={`job-item ${application.matchedYn ? 'matched' : 'not-matched'}`} key={application.id}>
                  <span>
                    Job ID: {application.jobId} - 고객 ID: {application.customerId}
                  </span>
                  <div className="status-icons">
                    <button onClick={() => handleWithdraw(application.id)}>삭제</button>
                  </div>
                </div>
              ))
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
