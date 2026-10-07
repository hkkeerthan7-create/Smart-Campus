import "../App.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Announcement() {
  const navigate = useNavigate();

  useEffect(() => {
    const isStudentLoggedIn =
      localStorage.getItem("isStudentLoggedIn");

    if (isStudentLoggedIn !== "true") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="dashboard-content">
      <h1>Announcements</h1>
      <p>Important campus updates</p>

      <div className="recent-issues">

        <div className="issue-item">
          <h3>Campus Maintenance</h3>
          <p>
            Scheduled maintenance will be carried out this weekend.
          </p>
        </div>

        <div className="issue-item">
          <h3>Internet Maintenance</h3>
          <p>
            Campus Wi-Fi may be temporarily unavailable during maintenance.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Announcement;