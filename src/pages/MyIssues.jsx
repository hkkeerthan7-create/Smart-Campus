import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyIssues() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isStudentLoggedIn = localStorage.getItem("isStudentLoggedIn");
    const studentEmail = localStorage.getItem("studentEmail");
    if (!isStudentLoggedIn) {
      navigate("/");
      return;
    }

    if (!studentEmail) {
      setLoading(false);
      return;
    }

    const loadMyIssues = async () => {
      try {
        const response = await fetch(
          `/api/issues/student/${encodeURIComponent(studentEmail)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load issues");
        }

        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch student issues:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMyIssues();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-content">
        <h2>My Issues</h2>
        <p>Loading your issues...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1>My Issues</h1>

      <p>Issues reported by you</p>

      {issues.length === 0 ? (
        <div className="recent-issues">
          <h2>No Issues Found</h2>
          <p>You have not reported any issues yet.</p>
        </div>
      ) : (
        <div className="recent-issues">

          {issues.map((issue) => (
            <div className="issue-item" key={issue.id}>

              <h3>{issue.title}</h3>

              <p>
                <strong>Category:</strong> {issue.category}
              </p>

              <p>
                <strong>Location:</strong> {issue.location}
              </p>

              <p>
                <strong>Priority:</strong> {issue.priority}
              </p>

              <p>
                <strong>Description:</strong> {issue.description}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span>{issue.status}</span>
              </p>

              {/* ADMIN RESPONSE */}

              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: "#f3f4f6"
                }}
              >
                <strong>Admin Response</strong>

                {issue.adminComment ? (
                  <p style={{ marginTop: "8px" }}>
                    {issue.adminComment}
                  </p>
                ) : (
                  <p style={{ marginTop: "8px" }}>
                    No response from admin yet.
                  </p>
                )}
              </div>

              <p>
                <strong>Reported:</strong>{" "}
                {new Date(issue.createdAt).toLocaleString()}
              </p>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default MyIssues;
