import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    appliedJobs: 0,
    avgScore: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8800/api/apply/user/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.container}>
      
      <h2 className={styles.header}>
        User Dashboard - HireNova AI 🚀
      </h2>

      {/* 🔹 Stats Cards */}
      <div className={styles.grid}>

        <div className={styles.card}>
          <h3>Available Jobs</h3>
          <p>{stats.totalJobs}</p>
        </div>

        <div className={styles.card}>
          <h3>Applied Jobs</h3>
          <p>{stats.appliedJobs}</p>
        </div>

        <div className={styles.card}>
          <h3>Avg Match Score</h3>
          <p>{stats.avgScore}%</p>
        </div>

        {/* 🔥 AI Insight */}
        <div className={styles.bigCard}>
          <h3>AI Insight 🤖</h3>
          <p>
            Your profile matches jobs with an average of{" "}
            {stats.avgScore}% compatibility.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;