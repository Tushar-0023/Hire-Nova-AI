import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

/* ================= VERIFY USER ================= */
const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Login required" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // 🔥 DEBUG (remove later if needed)
    console.log("JWT USER:", user);

    req.user = user;
    next();
  });
};

/* ================= APPLY JOB ================= */
router.post("/:jobId", verifyUser, (req, res) => {
  try {
    // 🔥 FIX: safe userId extraction
    const userId = req.user.userId || req.user.id;
    const jobId = req.params.jobId;
    const { resume } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    if (!resume || resume.trim() === "") {
      return res.status(400).json({
        message: "Please enter your skills/resume",
      });
    }

    // 🔍 Check duplicate application
    const checkQuery =
      "SELECT * FROM applications WHERE job_id = ? AND user_id = ?";

    db.query(checkQuery, [jobId, userId], (err, data) => {
      if (err) {
        console.log("CHECK ERROR:", err);
        return res.status(500).json(err);
      }

      if (data.length > 0) {
        return res.status(400).json({
          message: "Already applied",
        });
      }

      // 🔥 INSERT APPLICATION
      const insertQuery = `
        INSERT INTO applications (job_id, user_id, resume)
        VALUES (?, ?, ?)
      `;

      db.query(insertQuery, [jobId, userId, resume], (err2) => {
        if (err2) {
          console.log("INSERT ERROR:", err2);
          return res.status(500).json(err2);
        }

        res.json({
          message: "Applied successfully",
        });
      });
    });
  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ================= USER DASHBOARD STATS ================= */
router.get("/user/stats", verifyUser, (req, res) => {
  const userId = req.user.userId || req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token user" });
  }

  const q = `
    SELECT 
      (SELECT COUNT(*) FROM jobs) AS totalJobs,
      (SELECT COUNT(*) FROM applications WHERE user_id = ?) AS appliedJobs
  `;

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.log("STATS ERROR:", err);
      return res.status(500).json(err);
    }

    const avgScore = data[0].appliedJobs > 0 ? 60 : 0;

    res.json({
      totalJobs: data[0].totalJobs,
      appliedJobs: data[0].appliedJobs,
      avgScore,
    });
  });
});

export default router;