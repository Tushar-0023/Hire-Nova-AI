import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // refresh UI
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3">

      {/* BRAND */}
      <Link className="navbar-brand fw-bold fs-4" to="/">
        HireNova <span className="text-info">AI</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navMenu">

        <ul className="navbar-nav ms-auto gap-3">

          {/* HOME */}
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>

          {/* ROLE BASED JOBS (SAFE VERSION) */}
          {token && (
            <li className="nav-item">
              <Link
                className="nav-link"
                to={
                  user && user.role === "recruiter"
                    ? "/recruiter-dashboard"
                    : "/jobs"
                }
              >
                Jobs
              </Link>
            </li>
          )}

          {/* ROLE BASED DASHBOARD */}
          {token && (
            <li className="nav-item">
              <Link
                className="nav-link"
                to={
                  user && user.role === "recruiter"
                    ? "/recruiter-dashboard"
                    : "/dashboard"
                }
              >
                Dashboard
              </Link>
            </li>
          )}

          {/* AUTH LINKS */}
          {!token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* USER INFO */}
              <li className="nav-item">
                <span className="nav-link text-info">
                  {user?.name}
                </span>
              </li>

              {/* LOGOUT */}
              <li className="nav-item">
                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}

        </ul>

        {/* CTA BUTTON */}
        {!token && (
          <Link
            to="/register"
            className="btn btn-info ms-3"
          >
            Get Started
          </Link>
        )}

      </div>
    </nav>
  );
}

export default Navbar;