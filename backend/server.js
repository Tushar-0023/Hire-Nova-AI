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

// ✅ Clean & normalize text
function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // remove symbols like . , /
    .split(" ")
    .filter(word => word.length > 2); // remove useless small words
}

// ✅ AI Match Score Function (Improved)
function calculateMatchScore(jobDesc, resume) {
  const jobWords = cleanText(jobDesc);
  const resumeWords = cleanText(resume);

  // Remove duplicates
  const uniqueJobWords = [...new Set(jobWords)];
  const uniqueResumeWords = [...new Set(resumeWords)];

  let matchCount = 0;

  uniqueJobWords.forEach(word => {
    if (uniqueResumeWords.includes(word)) {
      matchCount++;
    }
  });

  const score =
    uniqueJobWords.length === 0
      ? 0
      : (matchCount / uniqueJobWords.length) * 100;

  return Math.round(score);
}

// ✅ Classification Function
function getCandidateStatus(score) {
  if (score >= 70) return "Strong Candidate";
  if (score >= 50) return "Good Candidate";
  return "Weak Candidate";
}

// ✅ AI Match API (USE THIS EVERYWHERE)
app.post("/api/match", (req, res) => {
  const { jobDesc, resume } = req.body;

  if (!jobDesc || !resume) {
    return res.status(400).json({
      message: "Missing job description or resume",
    });
  }

  const score = calculateMatchScore(jobDesc, resume);
  const status = getCandidateStatus(score);

  // 🔍 Debug (optional - remove later)
  console.log("----- AI MATCH DEBUG -----");
  console.log("Job Desc:", jobDesc);
  console.log("Resume:", resume);
  console.log("Score:", score);
  console.log("Status:", status);

  res.json({
    score,
    status,
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