import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/AdminDashboard.module.css";

function AdminDashboard() {
  const [jobs, setJobs] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [scores, setScores] = useState({});

  const token = localStorage.getItem("token");

  // 🔥 AUTO AI + FETCH
  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/jobs/admin/jobs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const grouped = {};
      const scoreResults = {};

      for (let item of res.data) {
        if (!grouped[item.jobId]) {
          grouped[item.jobId] = {
            title: item.title,
            company: item.company,
            location: item.location,
            applicants: [],
          };
        }

        if (item.name) {
          const index = grouped[item.jobId].applicants.length;

          grouped[item.jobId].applicants.push({
            name: item.name,
            email: item.email,
            resume: item.resume || "React SQL developer",
          });

          // 🔥 AUTO AI CALL
          const key = `${item.jobId}-${index}`;

          try {
            const aiRes = await axios.post(
              "http://localhost:8800/api/match",
              {
                jobDesc: item.title,
                resume: item.resume || "React SQL developer",
              }
            );

            scoreResults[key] = aiRes.data;
          } catch (err) {
            console.log("AI error:", err);
          }
        }
      }

      setJobs(grouped);
      setScores(scoreResults);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8800/api/jobs/add",
        { title, company, location, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job added successfully");

      setTitle("");
      setCompany("");
      setLocation("");
      setDescription("");

      fetchJobs();
    } catch {
      alert("Error adding job");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await axios.delete(
        `http://localhost:8800/api/jobs/delete/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job deleted");
      fetchJobs();
    } catch {
      alert("Error deleting job");
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.logo}>HireNova AI 🤖</h2>

        <div className={styles.menu}>
          <p onClick={() => setActiveTab("dashboard")}>📊 Dashboard</p>
          <p onClick={() => setActiveTab("jobs")}>💼 Jobs</p>
          <p onClick={() => setActiveTab("applicants")}>👥 Applicants</p>
        </div>
      </div>

      {/* Main */}
      <div className={styles.main}>
        
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h2 className={styles.header}>Recruiter Dashboard 🚀</h2>

            <div className={styles.grid}>
              <div className={styles.card}>
                <h3>Total Jobs</h3>
                <p>{Object.keys(jobs).length}</p>
              </div>

              <div className={styles.card}>
                <h3>Total Applicants</h3>
                <p>
                  {Object.values(jobs).reduce(
                    (acc, j) => acc + j.applicants.length,
                    0
                  )}
                </p>
              </div>

              <div className={styles.card}>
                <h3>AI Score Avg</h3>
                <p>
                  {Object.values(scores).length > 0
                    ? Math.round(
                        Object.values(scores).reduce(
                          (acc, s) => acc + s.score,
                          0
                        ) / Object.values(scores).length
                      )
                    : 0}
                  %
                </p>
              </div>

              <div className={styles.bigCard}>
                <h3>AI Insight 🤖</h3>
                <p>Auto AI evaluates candidates instantly.</p>
              </div>
            </div>
          </>
        )}

        {/* JOBS TAB (STYLING FIXED) */}
        {activeTab === "jobs" && (
          <>
            <h2 className={styles.header}>Manage Jobs</h2>

            {/* FORM */}
            <form onSubmit={handleAddJob} className={styles.formCard}>
              <h3>➕ Add New Job</h3>

              <div className={styles.grid}>
                <input
                  placeholder="Job Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <input
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />

                <input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />

                <textarea
                  placeholder="Job Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.primaryBtn}>
                🚀 Post Job
              </button>
            </form>

            {/* JOB GRID */}
            <div className={styles.jobsGrid}>
              {Object.keys(jobs).map((jobId) => (
                <div key={jobId} className={styles.jobCard}>
                  <div className={styles.jobTop}>
                    <h3>{jobs[jobId].title}</h3>
                    <span>{jobs[jobId].company}</span>
                  </div>

                  <p className={styles.location}>
                    📍 {jobs[jobId].location}
                  </p>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(jobId)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* APPLICANTS TAB (STYLING + AUTO AI) */}
        {activeTab === "applicants" && (
          <>
            <h2 className={styles.header}>Applicants + AI 🤖</h2>

            {Object.keys(jobs).map((jobId) => (
              <div key={jobId} className={styles.jobCard}>
                <h3>{jobs[jobId].title}</h3>

                <h4>{jobs[jobId].applicants.length} Applicants</h4>

                {jobs[jobId].applicants.length === 0 ? (
                  <p className={styles.empty}>No applicants yet</p>
                ) : (
                  jobs[jobId].applicants.map((app, i) => {
                    const key = `${jobId}-${i}`;
                    const result = scores[key];

                    return (
                      <div key={i} className={styles.applicant}>
                        👤 {app.name} — {app.email}

                        {result ? (
                          <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                            {result.score}% ({result.message})
                          </span>
                        ) : (
                          <span style={{ marginLeft: "10px" }}>
                            Analyzing...
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;