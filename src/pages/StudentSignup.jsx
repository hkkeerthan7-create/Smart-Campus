import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function StudentSignup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (email === "" || password === "" || confirmPassword === "") {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "/api/create-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Student account created successfully!");

      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Smart Campus</h1>
        <p className="subtitle">Student Registration</p>

        <form onSubmit={handleSignup}>
          <label>Email / USN</label>

          <input
            type="text"
            placeholder="Enter your email or USN"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="login-button"
          >
            Create Account
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          â† Back to Student Login
        </button>
      </div>
    </div>
  );
}

export default StudentSignup;
