import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { analyzeCandidate } from "../services/aiMatchingService.js";

const router = express.Router();

/* ================= VERIFY USER ================= */
const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Login required",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  });
};

/* ================= GET MY APPLICATIONS ================= */
router.get("/user/applications", verifyUser, (req, res) => {
  const userId = req.user.userId || req.user.id;

  const q = `
    SELECT job_id
    FROM applications
    WHERE user_id = ?
  `;

  db.query(q, [userId], (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    return res.json(data);
  });
});

/* ================= APPLY JOB + AI MATCHING ================= */
router.post("/:jobId", verifyUser, async (req, res) => {
  const userId = req.user.userId || req.user.id;
  const jobId = req.params.jobId;
  const { resume } = req.body;

  if (!userId) {
    return res.status(401).json({
      message: "Invalid token user",
    });
  }

  if (!resume || resume.trim() === "") {
    return res.status(400).json({
      message: "Please enter your skills/resume",
    });
  }

  try {
    /* ================= GET JOB TITLE ================= */
    const jobQuery = `
      SELECT title
      FROM jobs
      WHERE id = ?
    `;

    const jobData = await new Promise((resolve, reject) => {
      db.query(jobQuery, [jobId], (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    if (jobData.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    /*
      IMPORTANT:

      Recruiter only provides the job title.

      Example:
      Full Stack Developer
      Frontend Developer
      Backend Developer
      Flutter Developer
      Java Developer
      AI/ML Developer

      The AI will determine the relevant skills
      automatically from this job title.
    */

    const jobTitle = jobData[0].title;

    /* ================= CHECK DUPLICATE ================= */
    const checkQuery = `
      SELECT id
      FROM applications
      WHERE job_id = ?
      AND user_id = ?
    `;

    const existingApplication = await new Promise((resolve, reject) => {
      db.query(
        checkQuery,
        [jobId, userId],
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        },
      );
    });

    if (existingApplication.length > 0) {
      return res.status(400).json({
        message: "Already applied",
      });
    }

    /* ================= INSERT APPLICATION ================= */
    const insertQuery = `
      INSERT INTO applications
      (job_id, user_id, resume)
      VALUES (?, ?, ?)
    `;

    const applicationId = await new Promise((resolve, reject) => {
      db.query(
        insertQuery,
        [jobId, userId, resume],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId);
          }
        },
      );
    });

    /* ================= AI ANALYSIS ================= */
    try {
      /*
        AI receives:

        1. Job Title
        2. Candidate Resume / Skills

        It dynamically determines the skills required
        for that particular job title.
      */

      const aiResult = await analyzeCandidate(
        jobTitle,
        resume,
      );

      /* ================= SAVE AI RESULT ================= */
      const updateQuery = `
        UPDATE applications
        SET
          match_score = ?,
          matched_skills = ?,
          missing_skills = ?,
          experience_match = ?,
          ai_explanation = ?
        WHERE id = ?
      `;

      await new Promise((resolve, reject) => {
        db.query(
          updateQuery,
          [
            aiResult.score,
            JSON.stringify(aiResult.matchedSkills),
            JSON.stringify(aiResult.missingSkills),
            aiResult.experienceMatch,
            aiResult.explanation,
            applicationId,
          ],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          },
        );
      });

      console.log(
        `AI analysis completed for application ${applicationId}`,
      );
    } catch (aiError) {
      console.error("AI analysis failed:", aiError);

      /*
        Important:
        Application is already saved.

        If Gemini temporarily fails, the candidate's
        application will NOT be lost.
      */
    }

    return res.json({
      message: "Applied successfully",
      applicationId,
    });
  } catch (error) {
    console.error("Apply error:", error);

    return res.status(500).json({
      message: "Error applying for job",
    });
  }
});

/* ================= USER DASHBOARD STATS ================= */
router.get("/user/stats", verifyUser, (req, res) => {
  const userId = req.user.userId || req.user.id;

  const q = `
    SELECT
      (SELECT COUNT(*) FROM jobs) AS totalJobs,

      (
        SELECT COUNT(*)
        FROM applications
        WHERE user_id = ?
      ) AS appliedJobs,

      (
        SELECT COALESCE(ROUND(AVG(match_score)), 0)
        FROM applications
        WHERE user_id = ?
        AND match_score IS NOT NULL
      ) AS avgScore
  `;

  db.query(q, [userId, userId], (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    return res.json({
      totalJobs: data[0].totalJobs,
      appliedJobs: data[0].appliedJobs,
      avgScore: data[0].avgScore,
    });
  });
});

/* ================= DELETE CANDIDATE ================= */
router.delete("/delete/:id", verifyUser, (req, res) => {
  const applicationId = req.params.id;

  const q = `
    DELETE FROM applications
    WHERE id = ?
  `;

  db.query(q, [applicationId], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.json({
      message: "Candidate removed successfully",
    });
  });
});

/* ================= GET ALL APPLICATIONS ================= */
router.get("/all", verifyUser, (req, res) => {
  const q = `
    SELECT
      a.id AS application_id,
      a.job_id,
      a.user_id,

      u.name,
      u.email,

      a.resume,

      j.title,
      j.description AS jobDesc,

      a.match_score,
      a.matched_skills,
      a.missing_skills,
      a.experience_match,
      a.ai_explanation,

      a.status,
      a.applied_at

    FROM applications a

    JOIN users u
      ON a.user_id = u.id

    JOIN jobs j
      ON a.job_id = j.id

    ORDER BY a.applied_at DESC
  `;

  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.json(data);
  });
});

export default router;
