const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

const User = require("./User");
const bcrypt = require("bcryptjs");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// ISSUE SCHEMA
// ===============================

const issueSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },

    studentEmail: {
      type: String,
      required: false
    },

    title: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    status: {
      type: String,
      default: "Open"
    },

    adminComment: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Issue = mongoose.model("Issue", issueSchema);


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


// ===============================
// TEST ROUTE
// ===============================

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend API is working!"
  });
});


// ===============================
// GET ALL ISSUES
// ===============================

app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find().sort({
      createdAt: -1
    });

    res.json(issues);

  } catch (error) {
    console.error("Failed to fetch issues:", error);

    res.status(500).json({
      message: "Failed to fetch issues"
    });
  }
});


// ===============================
// GET STUDENT-SPECIFIC ISSUES
// ===============================

app.get("/api/issues/student/:email", async (req, res) => {
  try {
    const issues = await Issue.find({
      studentEmail: req.params.email
    }).sort({
      createdAt: -1
    });

    res.json(issues);

  } catch (error) {
    console.error("Failed to fetch student issues:", error);

    res.status(500).json({
      message: "Failed to fetch student issues"
    });
  }
});


// ===============================
// CREATE NEW ISSUE
// ===============================

app.post("/api/issues", async (req, res) => {
  try {
    const newIssue = new Issue(req.body);

    await newIssue.save();

    res.status(201).json({
      message: "Issue created successfully!",
      issue: newIssue
    });

  } catch (error) {
    console.error("Issue creation error:", error);

    res.status(500).json({
      message: "Failed to create issue"
    });
  }
});


// ===============================
// UPDATE ISSUE STATUS
// ===============================

app.put("/api/issues/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findOneAndUpdate(
      {
        id: Number(req.params.id)
      },
      {
        status: status
      },
      {
        new: true
      }
    );

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found"
      });
    }

    res.json({
      message: "Issue status updated successfully",
      issue: issue
    });

  } catch (error) {
    console.error("Status update error:", error);

    res.status(500).json({
      message: "Failed to update issue status"
    });
  }
});


// ===============================
// UPDATE ADMIN COMMENT
// ===============================

app.put("/api/issues/:id/comment", async (req, res) => {
  try {
    const { adminComment } = req.body;

    const issue = await Issue.findOneAndUpdate(
      {
        id: Number(req.params.id)
      },
      {
        adminComment: adminComment
      },
      {
        new: true
      }
    );

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found"
      });
    }

    res.json({
      message: "Admin comment updated successfully",
      issue: issue
    });

  } catch (error) {
    console.error("Comment update error:", error);

    res.status(500).json({
      message: "Failed to update admin comment"
    });
  }
});


// ===============================
// CREATE ADMIN
// ===============================

app.post("/api/create-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await User.findOne({
      email: email
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const admin = new User({
      email: email,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully!"
    });

  } catch (error) {
    console.error("Admin creation error:", error);

    res.status(500).json({
      message: "Failed to create admin"
    });
  }
});


// ===============================
// ADMIN LOGIN
// ===============================

app.post("/api/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({
      email: email,
      role: "admin"
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid admin email or password"
      });
    }

    res.json({
      message: "Admin login successful!",

      admin: {
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Server error during admin login"
    });
  }
});


// ===============================
// CREATE STUDENT
// ===============================

app.post("/api/create-student", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingStudent = await User.findOne({
      email: email
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const student = new User({
      email: email,
      password: hashedPassword,
      role: "student"
    });

    await student.save();

    res.status(201).json({
      message: "Student created successfully!"
    });

  } catch (error) {
    console.error("Student creation error:", error);

    res.status(500).json({
      message: "Failed to create student"
    });
  }
});


// ===============================
// STUDENT LOGIN
// ===============================

app.post("/api/student-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await User.findOne({
      email: email,
      role: "student"
    });

    if (!student) {
      return res.status(401).json({
        message: "Invalid student email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid student email or password"
      });
    }

    res.json({
      message: "Student login successful!",

      student: {
        email: student.email,
        role: student.role
      }
    });

  } catch (error) {
    console.error("Student login error:", error);

    res.status(500).json({
      message: "Server error during student login"
    });
  }
});
app.post("/api/analyze-issue", async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/analyze-issue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error("AI service error:", error);

    res.status(500).json({
      message: "AI service is unavailable"
    });
  }
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});