import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Please enter your Email/USN and Password");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/student-login",
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

      localStorage.setItem("studentEmail", data.student.email);
      localStorage.setItem("isStudentLoggedIn", "true");

      alert("Student login successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error("Student login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Smart Campus</h1>
        <p className="subtitle">Student Login</p>

        <button
          type="button"
          onClick={() => navigate("/admin-login")}
        >
          Admin Login
        </button>
        <button
  type="button"
  onClick={() => navigate("/student-signup")}
>
  Create New Student Account
</button>

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
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

          <button
            type="submit"
            className="login-button"
          >
            Student Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;