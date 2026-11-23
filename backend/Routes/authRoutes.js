import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

/* ================= REGISTER (ONLY USER) ================= */
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const q =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";

  db.query(q, [name, email, hashedPassword], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      return res.status(500).json({
        message: err.message,
      });
    }

    return res.json({
      message: "User registered successfully",
    });
  });
});

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  /* ================= FIXED RECRUITER LOGIN ================= */
  if (
  email === "tusharsingh2323@gmail.com" &&
  password === "Recruiter@123"
) {
  const token = jwt.sign(
    {
      id: 1,
      role: "recruiter",
    },
    "secretkey",
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: {
      id: 1,
      name: "Recruiter",
      email: "tusharsingh2323@gmail.com",
      role: "recruiter",
    },
  });
}

  /* ================= NORMAL USER LOGIN ================= */
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [email], (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = data[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      "secretkey",
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
});

export default router;