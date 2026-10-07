import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const isStudentLoggedIn =
      localStorage.getItem("isStudentLoggedIn");
    if (!isStudentLoggedIn) {
      navigate("/");
      return;
    }
    const loadIssues = async () => {
      try {
      const studentEmail = localStorage.getItem("studentEmail");
      const response = await fetch(
  `http://127.0.0.1:5000/api/issues/student/${encodeURIComponent(studentEmail)}`
);

        const data = await response.json();

        setIssues(data);
      } catch (error) {
        console.error("Error loading issues:", error);
      }
    };

    loadIssues();
  }, []);

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <h2>Smart Campus</h2>

        <nav>
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/my-issues")}>
            My Issues
          </button>

          <button onClick={() => navigate("/report-issue")}>
            Report Issue
          </button>

          <button onClick={() => navigate("/announcement")}>
            Announcements
          </button>

          <button onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button onClick={() => {
            localStorage.removeItem("studentEmail");
            localStorage.removeItem("isStudentLoggedIn");
            navigate("/");
          }}>
            Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-content">

        <h1>Welcome to Smart Campus</h1>
        <p>Student Dashboard</p>

        <div className="stats-container">

          <div className="stat-card">
            <h3>Total Issues</h3>
            <p>{issues.length}</p>
          </div>

          <div className="stat-card">
            <h3>Open</h3>
            <p>
              {issues.filter(
                (issue) => issue.status === "Open"
              ).length}
            </p>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <p>
              {issues.filter(
                (issue) => issue.status === "In Progress"
              ).length}
            </p>
          </div>

          <div className="stat-card">
            <h3>Resolved</h3>
            <p>
              {issues.filter(
                (issue) => issue.status === "Resolved"
              ).length}
            </p>
          </div>

        </div>

        <div className="recent-issues">

          <h2>Recent Issues</h2>

          {issues.length === 0 ? (
            <p>No issues reported yet.</p>
          ) : (
            issues
              .slice(0, 5)
              .map((issue) => (
                <div
                  className="issue-item"
                  key={issue.id}
                >
                  <h3>{issue.title}</h3>

                  <p>
                    <strong>Location:</strong>{" "}
                    {issue.location}
                  </p>

                  <p>
                    <strong>Category:</strong>{" "}
                    {issue.category}
                  </p>

                  <span>{issue.status}</span>
                </div>
              ))
          )}

        </div>

      </main>
    </div>
  );
}

export default Dashboard;