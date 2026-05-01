function Footer() {
  return (
    <footer className="bg-dark text-light text-center text-lg-start mt-5">

      <div className="container p-4">

        <div className="row">

          {/* About */}
          <div className="col-lg-6 col-md-12 mb-4">
            <h5 className="fw-bold">HireNova AI</h5>
            <p>
              An AI-powered recruitment platform that connects talent with opportunities faster and smarter.
            </p>
          </div>

          {/* Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/jobs" className="text-light text-decoration-none">Jobs</a></li>
              <li><a href="/dashboard" className="text-light text-decoration-none">Dashboard</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold">Contact</h5>
            <p>Email: support@hirenova.ai</p>
            <p>India</p>
          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="text-center p-3 bg-secondary">
        © {new Date().getFullYear()} HireNova AI | All Rights Reserved
      </div>

    </footer>
  );
}

export default Footer;