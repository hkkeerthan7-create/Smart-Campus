import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Please enter admin email and password");
      return;
    }

    try {
      const response = await fetch(
        "/api/admin-login",
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

      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminEmail", data.admin.email);

      alert("Admin login successful!");

      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Smart Campus</h1>

        <p className="subtitle">
          Admin Login
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          â† Student Login
        </button>

        <form onSubmit={handleLogin}>
          <label>Admin Email</label>

          <input
            type="email"
            placeholder="Enter admin email"
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
            Admin Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
