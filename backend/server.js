import express from "express";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";
import jobRoutes from "./Routes/jobRoutes.js";
import applyRoutes from "./Routes/applyRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/apply", applyRoutes);

// 🔥 ================= AI FEATURE START =================

// AI Match Score Function
function calculateMatchScore(jobDesc, resume) {
  const jobWords = jobDesc.toLowerCase().split(" ");
  const resumeWords = resume.toLowerCase().split(" ");

  let matchCount = 0;

  jobWords.forEach(word => {
    if (resumeWords.includes(word)) {
      matchCount++;
    }
  });

  const score = (matchCount / jobWords.length) * 100;
  return Math.round(score);
}

// AI Match API
app.post("/api/match", (req, res) => {
  const { jobDesc, resume } = req.body;

  if (!jobDesc || !resume) {
    return res.status(400).json({ message: "Missing job description or resume" });
  }

  const score = calculateMatchScore(jobDesc, resume);

  res.json({
    score,
    message:
      score > 80
        ? "Strong Candidate"
        : score > 50
        ? "Average Candidate"
        : "Weak Candidate",
  });
});

// 🔥 ================= AI FEATURE END =================

// Test route
app.get("/", (req, res) => {
  res.send("HireNova AI Backend Running");
});

// Server
const PORT = 8800;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});