import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
   useEffect(() => {
  const isAdminLoggedIn =
    localStorage.getItem("isAdminLoggedIn");

  if (isAdminLoggedIn !== "true") {
    navigate("/admin-login");
  }
}, [navigate]);
  
useEffect(() => {
  fetch("http://127.0.0.1:5000/api/issues")
    .then((response) => response.json())
    .then((data) => {
      setIssues(data);
    })
    .catch((error) => {
      console.error("Failed to fetch issues:", error);
    });
}, []);

  const handleStatusChange = async (id, newStatus) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/issues/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    const updatedIssues = issues.map((issue) =>
      issue.id === id
        ? { ...issue, status: newStatus }
        : issue
    );

    setIssues(updatedIssues);

  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Failed to update issue status");
  }
};
  const handleCommentChange = async (id, newComment) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/issues/${id}/comment`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminComment: newComment
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    const updatedIssues = issues.map((issue) =>
      issue.id === id
        ? { ...issue, adminComment: newComment }
        : issue
    );

    setIssues(updatedIssues);

  } catch (error) {
    console.error("Failed to update admin comment:", error);
    alert("Failed to update admin comment");
  }
};

  return (
    <div className="admin-dashboard">

      <h1>Admin Dashboard</h1>
      <p>Manage and monitor all campus issues</p>
      <button
  className="admin-logout-button"
  onClick={() => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin-login");
  }}
>
  Logout
</button>

      {/* Statistics */}
      <div className="admin-stats">

        <div className="admin-stat-card total">
          <h3>Total Issues</h3>
          <p>{issues.length}</p>
        </div>

        <div className="admin-stat-card open">
          <h3>Open</h3>
          <p>
            {issues.filter(
              (issue) => issue.status === "Open"
            ).length}
          </p>
        </div>

        <div className="admin-stat-card progress">
          <h3>In Progress</h3>
          <p>
            {issues.filter(
              (issue) => issue.status === "In Progress"
            ).length}
          </p>
        </div>

        <div className="admin-stat-card resolved">
          <h3>Resolved</h3>
          <p>
            {issues.filter(
              (issue) => issue.status === "Resolved"
            ).length}
          </p>
        </div>

      </div>

      {/* All Issues */}
      <div className="admin-issues">

        <h2>All Reported Issues</h2>
        <div className="admin-filters">

  <input
    type="text"
    placeholder="Search issues..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="All">All Status</option>
    <option value="Open">Open</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
  </select>

</div>

       {issues.length === 0 ? (
  <p>No issues reported yet.</p>
) : (
  issues
    .filter((issue) => {
      const matchesSearch =
        issue.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        issue.category
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        issue.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        issue.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .map((issue) => (

            <div
              className="admin-issue-card"
              key={issue.id}
            >

              <div>
                <h3>{issue.title}</h3>

                <p>
                  <strong>Category:</strong>{" "}
                  {issue.category}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {issue.location}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {issue.priority}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {issue.description}
                </p>
              </div>

              {/* Status */}
              <div className="admin-issue-status">

                <label>Status</label>

                <select
                  value={issue.status}
                  onChange={(e) =>
                    handleStatusChange(
                      issue.id,
                      e.target.value
                    )
                  }
                >
                  <option value="Open">
                    Open
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </select>

              </div>
              <div className="admin-comment">

  <label>Admin Comment</label>

  <textarea
    placeholder="Write an update for the student..."
    value={issue.adminComment || ""}
    onChange={(e) =>
      handleCommentChange(
        issue.id,
        e.target.value
      )
    }
  ></textarea>

</div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;