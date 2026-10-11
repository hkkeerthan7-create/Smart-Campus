import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import MyIssues from "./pages/MyIssues";
import AdminDashboard from "./pages/AdminDashboard";  
import AdminLogin from "./pages/AdminLogin";  
import Announcement from "./pages/Announcement";
import Profile from "./pages/Profile";
import StudentSignup from "./pages/StudentSignup";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/my-issues" element={<MyIssues />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />  
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/student-signup" element={<StudentSignup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;