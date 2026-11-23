import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "../styles/Jobs.module.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [resumeInput, setResumeInput] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        // Fetch all jobs
        const jobsRes = await axios.get("http://localhost:8800/api/jobs");

        setJobs(jobsRes.data);

        // Fetch applications of logged-in user
        if (token) {
          const applicationsRes = await axios.get(
            "http://localhost:8800/api/apply/user/applications",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const appliedJobIds = applicationsRes.data.map(
            (application) => application.job_id,
          );

          setAppliedJobs(appliedJobIds);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchJobsAndApplications();
  }, [token]);

  // 🔥 APPLY WITH RESUME TEXT
  const handleApply = async () => {
    if (!token || !user) {
      alert("Please login first to apply.");
      navigate("/login");
      return;
    }

    if (!resumeInput.trim()) {
      alert("Please enter your skills or resume");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8800/api/apply/${selectedJob}`,
        {
          resume: resumeInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Applied Successfully");

      setAppliedJobs((prev) => [...prev, selectedJob]);

      // reset modal
      setResumeInput("");
      setSelectedJob(null);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.heading}>Available Jobs</h2>

      <div className={style.grid}>
        {jobs.map((job) => {
          const alreadyApplied = appliedJobs.includes(job.id);

          return (
            <div key={job.id} className={style.card}>
              <h3 className={style.title}>{job.title}</h3>

              <p className={style.company}>{job.company}</p>

              <p className={style.location}>📍 {job.location}</p>

              <p className={style.description}>{job.description}</p>

              <button
                className={style.button}
                onClick={() => setSelectedJob(job.id)}
                disabled={alreadyApplied}
              >
                {alreadyApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
          );
        })}
      </div>

      {/* 🔥 MODAL */}
      {selectedJob && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <h3>Enter your skills / resume</h3>

            <p className={style.helperText}>
              Example: React, Node.js, SQL, MongoDB
            </p>

            <textarea
              placeholder="Type your skills here..."
              value={resumeInput}
              onChange={(e) => setResumeInput(e.target.value)}
              className={style.textarea}
            />

            <div className={style.modalButtons}>
              <button onClick={handleApply}>🚀 Submit</button>

              <button onClick={() => setSelectedJob(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
