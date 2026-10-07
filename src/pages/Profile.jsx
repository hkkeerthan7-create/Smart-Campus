import "../App.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const isStudentLoggedIn =
    localStorage.getItem("isStudentLoggedIn");

  useEffect(() => {
    if (isStudentLoggedIn !== "true") {
      navigate("/", { replace: true });
    }
  }, [isStudentLoggedIn, navigate]);

  if (isStudentLoggedIn !== "true") {
    return null;
  }

  const studentEmail =
    localStorage.getItem("studentEmail");

  return (
    <div className="dashboard-content">
      <h1>Student Profile</h1>
      <p>Your account information</p>

      <div className="recent-issues">
        <div className="issue-item">
          <h3>Student Information</h3>

          <p>
            <strong>Email / USN:</strong>{" "}
            {studentEmail || "Not available"}
          </p>

          <p>
            <strong>Role:</strong> Student
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;