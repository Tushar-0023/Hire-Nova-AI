import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

/* ================= MIDDLEWARE ================= */
const verifyRecruiter = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Login required"
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token"
      });
    }

    if (user.role !== "recruiter") {
      return res.status(403).json({
        message: "Recruiter access only"
      });
    }

    req.user = user;
    next();
  });
};

/* ================= GET ALL JOBS ================= */
router.get("/", (req, res) => {
  db.query("SELECT * FROM jobs", (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

/* ================= ADD JOB ================= */
router.post("/add", verifyRecruiter, (req, res) => {
  const {
    title,
    company,
    location,
    description
  } = req.body;

  const q = `
    INSERT INTO jobs
    (title, company, location, description)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    q,
    [title, company, location, description],
    (err) => {
      if (err)
        return res.status(500).json(err);

      return res.json({
        message: "Job added successfully"
      });
    }
  );
});

/* ================= ADMIN JOBS ================= */
router.get(
  "/admin/jobs",
  verifyRecruiter,
  (req, res) => {
    const q = `
      SELECT 
        jobs.id AS jobId,
        jobs.title,
        jobs.company,
        jobs.location,
        users.name,
        users.email
      FROM jobs
      LEFT JOIN applications 
      ON jobs.id = applications.job_id
      LEFT JOIN users 
      ON applications.user_id = users.id
    `;

    db.query(q, (err, data) => {
      if (err)
        return res.status(500).json(err);

      return res.json(data);
    });
  }
);

/* ================= ADMIN STATS ================= */
router.get(
  "/admin/stats",
  verifyRecruiter,
  (req, res) => {
    db.query(
      "SELECT COUNT(*) AS totalJobs FROM jobs",
      (err, jobsData) => {
        if (err)
          return res.status(500).json(err);

        db.query(
          "SELECT COUNT(*) AS totalApps FROM applications",
          (err2, appsData) => {
            if (err2)
              return res.status(500).json(err2);

            return res.json({
              totalJobs:
                jobsData[0].totalJobs,
              totalApps:
                appsData[0].totalApps,
              hired: 0
            });
          }
        );
      }
    );
  }
);

/* ================= DELETE JOB ================= */
router.delete(
  "/delete/:id",
  verifyRecruiter,
  (req, res) => {
    const jobId = req.params.id;

    db.query(
      "DELETE FROM applications WHERE job_id = ?",
      [jobId],
      (err) => {
        if (err)
          return res.status(500).json(err);

        db.query(
          "DELETE FROM jobs WHERE id = ?",
          [jobId],
          (err2) => {
            if (err2)
              return res.status(500).json(err2);

            return res.json({
              message:
                "Job deleted successfully"
            });
          }
        );
      }
    );
  }
);

export default router;