import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1>HireNova AI 🚀</h1>

          <h2>Smarter Hiring. Faster Decisions.</h2>

          <p>
            AI-powered recruitment platform that automates screening,
            matches candidates, and helps companies hire top talent instantly.
          </p>

          <div className={styles.buttons}>
            <Link to="/register" className={styles.primaryBtn}>
              Get Started Free
            </Link>

            {/* 🔥 FIXED */}
            <button
              className={styles.secondaryBtn}
              onClick={() => navigate("/login")}
            >
              View Dashboard Demo
            </button>
          </div>

          <div className={styles.badges}>
            <span>⚡ Fast Matching</span>
            <span>🤖 AI Screening</span>
            <span>📊 Real Insights</span>
          </div>
        </div>

        <div className={styles.heroRight}>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="AI Hiring"
          />
        </div>
      </section>

      {/* TRUST */}
      <section className={styles.trust}>
        <p>Trusted by modern companies</p>

        <div className={styles.stats}>
          <div>
            <h2>10K+</h2>
            <p>Companies</p>
          </div>

          <div>
            <h2>1M+</h2>
            <p>Candidates</p>
          </div>

          <div>
            <h2>95%</h2>
            <p>AI Match Accuracy</p>
          </div>

          <div>
            <h2>24/7</h2>
            <p>Automation</p>
          </div>
        </div>
      </section>

      {/* 🔥 FEATURES (NOW CLICKABLE) */}
      <section className={styles.features}>
        <h2>AI Features</h2>

        <div className={styles.grid}>
          <div
            className={styles.card}
            onClick={() => navigate("/login")}
          >
            <h3>Resume Screening 🤖</h3>
            <p>Check candidate-job match using AI scoring.</p>
          </div>

          <div
            className={styles.card}
            onClick={() => navigate("/login")}
          >
            <h3>Smart Matching</h3>
            <p>Automatically match best candidates.</p>
          </div>

          <div className={styles.card}>
            <h3>AI Insights</h3>
            <p>Dashboard shows hiring intelligence.</p>
          </div>

          <div className={styles.card}>
            <h3>Analytics</h3>
            <p>Track hiring trends and performance.</p>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className={styles.showcase}>
        <h2>AI That Understands Talent</h2>
        <p>
          Our system analyzes job descriptions and resumes to generate
          intelligent match scores.
        </p>

        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692"
          alt="workspace"
        />
      </section>

      {/* 🔥 STEPS (MORE REALISTIC) */}
      <section className={styles.stepsSection}>
        <h2>How It Works</h2>

        <div className={styles.steps}>
          <div>Post Job</div>
          <div>Applicants Apply</div>
          <div>AI Calculates Match</div>
          <div>Hire Smartly</div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <h2>What Recruiters Say</h2>

        <div className={styles.testGrid}>
          <div className={styles.testCard}>
            “Reduced hiring time by 70%”
          </div>

          <div className={styles.testCard}>
            “AI match feature is game changer”
          </div>

          <div className={styles.testCard}>
            “Best recruitment tool for startups”
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Start Hiring Smarter Today</h2>
        <p>Experience AI-powered recruitment now.</p>

        <Link to="/register" className={styles.primaryBtn}>
          Get Started Free
        </Link>
      </section>

    </div>
  );
}