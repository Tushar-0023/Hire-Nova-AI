import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/AdminDashboard.module.css";

function AdminDashboard() {
  const [jobs, setJobs] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");

  // Controls recruiter sidebar from Navbar hamburger
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const token = localStorage.getItem("token");

  /* =========================================================
     FETCH JOBS + APPLICANTS
  ========================================================= */

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/jobs/admin/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const grouped = {};

      for (const item of res.data) {
        if (!grouped[item.jobId]) {
          grouped[item.jobId] = {
            title: item.title,
            company: item.company,
            location: item.location,
            description: item.jobDesc || "",
            applicants: [],
          };
        }

        if (item.application_id && item.name) {
          grouped[item.jobId].applicants.push({
            application_id: item.application_id,
            userId: item.userId,
            name: item.name,
            email: item.email,
            resume: item.resume || "",

            match_score:
              item.match_score !== null && item.match_score !== undefined
                ? Number(item.match_score)
                : null,

            matched_skills: item.matched_skills || "[]",
            missing_skills: item.missing_skills || "[]",
            experience_match: item.experience_match || "",
            ai_explanation: item.ai_explanation || "",
            status: item.status || "pending",
            applied_at: item.applied_at,
          });
        }
      }

      setJobs(grouped);
    } catch (err) {
      console.log("Fetch recruiter jobs error:", err);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchJobs();
  }, []);

  /* =========================================================
     NAVBAR HAMBURGER → SIDEBAR
  ========================================================= */

  useEffect(() => {
    const handleTabChange = (event) => {
      setActiveTab(event.detail);
    };

    window.addEventListener("recruiterTabChange", handleTabChange);

    return () => {
      window.removeEventListener("recruiterTabChange", handleTabChange);
    };
  }, []);

  /* =========================================================
     ADD JOB
  ========================================================= */

  const handleAddJob = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8800/api/jobs/add",
        {
          title,
          company,
          location,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Job added successfully");

      setTitle("");
      setCompany("");
      setLocation("");
      setDescription("");

      fetchJobs();
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Error adding job");
    }
  };

  /* =========================================================
     DELETE JOB
  ========================================================= */

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8800/api/jobs/delete/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Job deleted");

      fetchJobs();
    } catch (err) {
      console.log(err);

      alert("Error deleting job");
    }
  };

  /* =========================================================
     DELETE CANDIDATE
  ========================================================= */

  const handleDeleteCandidate = async (id) => {
    if (!id) {
      alert("Invalid candidate ID");
      return;
    }

    if (!window.confirm("Remove this candidate?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8800/api/apply/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Candidate removed");

      setSelectedApplicant(null);

      fetchJobs();
    } catch (err) {
      console.log(err);

      alert("Error removing candidate");
    }
  };

  /* =========================================================
     PARSE AI SKILLS
  ========================================================= */

  const parseSkills = (skills) => {
    if (!skills) {
      return [];
    }

    if (Array.isArray(skills)) {
      return skills;
    }

    try {
      const parsed = JSON.parse(skills);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      return [];
    } catch {
      return [];
    }
  };

  /* =========================================================
     ALL APPLICANTS
  ========================================================= */

  const allApplicants = Object.values(jobs).flatMap((job) => job.applicants);

  /* =========================================================
     ANALYZED APPLICANTS
  ========================================================= */

  const analyzedApplicants = allApplicants.filter(
    (app) => app.match_score !== null && app.match_score !== undefined,
  );

  /* =========================================================
     AI AVERAGE
  ========================================================= */

  const averageScore =
    analyzedApplicants.length > 0
      ? Math.round(
          analyzedApplicants.reduce(
            (total, app) => total + Number(app.match_score),
            0,
          ) / analyzedApplicants.length,
        )
      : 0;

  /* =========================================================
     SCORE LABEL
  ========================================================= */

  const getScoreLabel = (score) => {
    if (score === null || score === undefined) {
      return "AI Analyzing";
    }

    if (score >= 80) {
      return "Strong Match";
    }

    if (score >= 60) {
      return "Good Match";
    }

    return "Weak Match";
  };

  return (
    <div className={styles.container}>
      {/* =================================================
          SIDEBAR
      ================================================= */}

      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <h2 className={styles.logo}>HireNova AI 🤖</h2>

        <div className={styles.menu}>
          <p
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
          >
            📊 Dashboard
          </p>

          <p
            onClick={() => {
              setActiveTab("jobs");
              setSidebarOpen(false);
            }}
          >
            💼 Jobs
          </p>

          <p
            onClick={() => {
              setActiveTab("applicants");
              setSidebarOpen(false);
            }}
          >
            👥 Applicants
          </p>
        </div>
      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className={styles.main}>
        {/* =================================================
            DASHBOARD
        ================================================= */}

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
                <p>{allApplicants.length}</p>
              </div>

              <div className={styles.card}>
                <h3>AI Score Average</h3>
                <p>{averageScore}%</p>
              </div>

              <div className={styles.bigCard}>
                <h3>AI Recruitment Matching 🤖</h3>

                <p>
                  AI automatically determines the relevant skills for each job
                  title and compares them with the candidate's submitted skills.
                </p>
              </div>
            </div>
          </>
        )}

        {/* =================================================
            JOBS
        ================================================= */}

        {activeTab === "jobs" && (
          <>
            <h2 className={styles.header}>Manage Jobs</h2>

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

            <div className={styles.jobsGrid}>
              {Object.keys(jobs).map((jobId) => (
                <div key={jobId} className={styles.jobCard}>
                  <h3>{jobs[jobId].title}</h3>

                  <span>{jobs[jobId].company}</span>

                  <p>📍 {jobs[jobId].location}</p>

                  <p>👥 {jobs[jobId].applicants.length} Applicants</p>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteJob(jobId)}
                  >
                    Delete Job
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* =================================================
            APPLICANTS
        ================================================= */}

        {activeTab === "applicants" && (
          <>
            <h2 className={styles.header}>Applicants + AI 🤖</h2>

            {Object.keys(jobs).length === 0 ? (
              <p className={styles.empty}>No jobs available.</p>
            ) : (
              Object.keys(jobs).map((jobId) => {
                const job = jobs[jobId];

                return (
                  <div key={jobId} className={styles.jobCard}>
                    <h3>💼 {job.title}</h3>

                    <p>
                      {job.company} • {job.location}
                    </p>

                    <p>👥 {job.applicants.length} Applicants</p>

                    {job.applicants.length === 0 ? (
                      <p className={styles.empty}>No applicants yet</p>
                    ) : (
                      job.applicants.map((app) => (
                        <div
                          key={app.application_id}
                          className={styles.applicant}
                        >
                          <div>
                            <strong>👤 {app.name}</strong>

                            <br />

                            <span>📧 {app.email}</span>
                          </div>

                          <div>
                            <strong>AI Match:</strong>{" "}
                            {app.match_score !== null &&
                            app.match_score !== undefined
                              ? `${app.match_score}%`
                              : "Analyzing..."}
                          </div>

                          <div>
                            <strong>{getScoreLabel(app.match_score)}</strong>
                          </div>

                          <div>
                            <strong>Experience:</strong>{" "}
                            {app.experience_match || "Analyzing..."}
                          </div>

                          <button onClick={() => setSelectedApplicant(app)}>
                            🔍 View AI Analysis
                          </button>

                          <button
                            style={{
                              marginLeft: "10px",
                              background: "red",
                              color: "white",
                              border: "none",
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                            }}
                            onClick={() =>
                              handleDeleteCandidate(app.application_id)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>

      {/* =================================================
          AI ANALYSIS MODAL
      ================================================= */}

      {selectedApplicant && (
        <div
          className={styles.modal}
          onClick={() => setSelectedApplicant(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedApplicant(null)}
              style={{
                float: "right",
                border: "none",
                background: "transparent",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h2>🤖 AI Candidate Analysis</h2>

            <h3>{selectedApplicant.name}</h3>

            <p>📧 {selectedApplicant.email}</p>

            <hr />

            <h3>💼 Job Role</h3>

            <p>This candidate was evaluated for the recruiter's job role.</p>

            <hr />

            <h1>{selectedApplicant.match_score ?? 0}%</h1>

            <p>AI Match Score</p>

            <p>
              <strong>{getScoreLabel(selectedApplicant.match_score)}</strong>
            </p>

            <hr />

            <h3>✅ Matched Skills</h3>

            {parseSkills(selectedApplicant.matched_skills).length > 0 ? (
              <ul>
                {parseSkills(selectedApplicant.matched_skills).map(
                  (skill, index) => (
                    <li key={index}>{skill}</li>
                  ),
                )}
              </ul>
            ) : (
              <p>No matched skills identified.</p>
            )}

            <h3>⚠️ Missing Skills</h3>

            {parseSkills(selectedApplicant.missing_skills).length > 0 ? (
              <ul>
                {parseSkills(selectedApplicant.missing_skills).map(
                  (skill, index) => (
                    <li key={index}>{skill}</li>
                  ),
                )}
              </ul>
            ) : (
              <p>No major missing skills.</p>
            )}

            <h3>💼 Experience Match</h3>

            <p>{selectedApplicant.experience_match || "Not available"}</p>

            <h3>🧠 AI Explanation</h3>

            <p>
              {selectedApplicant.ai_explanation ||
                "AI explanation not available."}
            </p>

            <h3>📄 Candidate Skills / Resume</h3>

            <p>{selectedApplicant.resume || "No resume provided."}</p>

            <button onClick={() => setSelectedApplicant(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
