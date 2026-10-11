import "../App.css";
import {useEffect ,useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportIssue() {
  const navigate = useNavigate();

useEffect(() => {
  const isStudentLoggedIn =
    localStorage.getItem("isStudentLoggedIn");

  if (isStudentLoggedIn !== "true") {
    navigate("/");
  }
}, [navigate]);
    const [title, setTitle] = useState("");
const [category, setCategory] = useState("Electrical");
const [location, setLocation] = useState("");
const [priority, setPriority] = useState("Low");
const [description, setDescription] = useState("");
const handleAIAnalyze = async () => {
  if (title === "" && description === "") {
    alert("Please enter the issue title or description first.");
    return;
  }

  try {
    const response = await fetch(
      "/api/analyze-issue",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          description: description
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "AI analysis failed");
      return;
    }

    setCategory(data.category);
    setPriority(data.priority);

    alert(
      `AI Analysis Complete!\nCategory: ${data.category}\nPriority: ${data.priority}`
    );
  } catch (error) {
    console.error("AI analysis error:", error);
    alert("Unable to connect to AI service");
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();

  const newIssue = {
  id: Date.now(),
  studentEmail: localStorage.getItem("studentEmail"),
  title,
  category,
  location,
  priority,
  description,
  status: "Open"
};

  try {
    const response = await fetch("/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newIssue)
    });

    const data = await response.json();

    console.log("Backend response:", data);

    // Keep localStorage also
    const existingIssues =
      JSON.parse(localStorage.getItem("issues")) || [];

    existingIssues.push(newIssue);

    localStorage.setItem(
      "issues",
      JSON.stringify(existingIssues)
    );

    alert("Issue submitted successfully!");

    console.log("Issue sent to backend:", newIssue);

  } catch (error) {
    console.error("Backend error:", error);
    alert("Could not connect to backend.");
  }
};
  return (
    <div className="report-page">
      <h1>Report an Issue</h1>
      <p>Tell us about the problem you are facing on campus.</p>

      <form onSubmit={handleSubmit}>
        <label>Issue Title</label>
        <input
          type="text"
          placeholder="Example: Classroom fan not working"
          value = {title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Category</label>
        <select
        value = {category}
        onChange={(e) => setCategory(e.target.value)}
        >
          <option>Electrical</option>
          <option>Internet</option>
          <option>Classroom</option>
          <option>Hostel</option>
          <option>Cleaning</option>
          <option>Other</option>
          <option>Plumbing</option>
        </select>

        <label>Location</label>
        <input
          type="text"
          placeholder="Example: Block A - Room 204"
            value = {location}
            onChange={(e) => setLocation(e.target.value)}
        />

        <label>Priority</label>
<select
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
>
  <option>Low</option>
  <option>Medium</option>
  <option>High</option>
</select>

        <label>Description</label>
        <textarea
          placeholder="Describe the issue..."
          rows="5"
          value = {description}
            onChange={(e) => setDescription(e.target.value)}                                    
        ></textarea>
        <button
  type="button"
  onClick={handleAIAnalyze}
>
  ðŸ¤– Analyze with AI
</button>

        <button type="submit">Submit Issue</button>
      </form>
    </div>
  );
}

export default ReportIssue;
