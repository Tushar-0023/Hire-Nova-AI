import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isRecruiter = user?.role === "recruiter";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  // Open recruiter dashboard and select a specific tab
  const handleRecruiterTab = (tab) => {
    if (!token || !isRecruiter) return;

    navigate("/recruiter-dashboard");

    // Wait for AdminDashboard to load, then switch tab
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("recruiterTabChange", {
          detail: tab,
        }),
      );
    }, 50);
  };

  return (
    <nav className={styles.navbar}>
      {/* BRAND */}
      <Link to="/" className={styles.brand}>
        HireNova <span>AI</span>
      </Link>

      {/* NAVIGATION */}
      <div className={styles.navContent}>
        {/* HOME */}
        <Link to="/" className={styles.navLink}>
          Home
        </Link>

        {/* RECRUITER */}
        {token && isRecruiter ? (
          <>
            <button
              className={styles.navLink}
              onClick={() => handleRecruiterTab("dashboard")}
            >
              Dashboard
            </button>

            <button
              className={styles.navLink}
              onClick={() => handleRecruiterTab("jobs")}
            >
              Jobs
            </button>

            <button
              className={styles.navLink}
              onClick={() => handleRecruiterTab("applicants")}
            >
              Applications
            </button>
          </>
        ) : token ? (
          <>
            {/* NORMAL USER */}
            <Link to="/jobs" className={styles.navLink}>
              Jobs
            </Link>

            <Link to="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
          </>
        ) : null}

        {/* AUTH */}
        {!token ? (
          <>
            <Link to="/login" className={styles.navLink}>
              Login
            </Link>

            <Link to="/register" className={styles.navLink}>
              Register
            </Link>

            <Link to="/register" className={styles.getStarted}>
              <span>Get Started</span>
              <span className={styles.arrow}>↗</span>
            </Link>
          </>
        ) : (
          <>
            {/* USER */}
            <span className={styles.userName}>{user?.name}</span>

            {/* LOGOUT */}
            <button className={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
