import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* =====================================================
          NAVIGATION SPACE
      ===================================================== */}

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroGrid}></div>

        <div className={styles.heroContent}>
          <div className={styles.aiBadge}>
            <span className={styles.statusDot}></span>
            AI-Powered Recruitment Intelligence
          </div>

          <h1>
            Hire the right
            <br />
            <span>talent with AI.</span>
          </h1>

          <p className={styles.heroText}>
            HireNova AI analyzes candidates against your job requirements and
            turns applications into intelligent hiring decisions.
          </p>

          <div className={styles.buttons}>
            <Link to="/register" className={styles.primaryBtn}>
              Start Hiring Free
              <span>→</span>
            </Link>

            <button
              className={styles.secondaryBtn}
              onClick={() => navigate("/login")}
            >
              Explore Dashboard
            </button>
          </div>

          <div className={styles.heroTrust}>
            <div>
              <strong>AI Matching</strong>
              <span>Real-time analysis</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Automated screening</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Hiring intelligence</span>
            </div>
          </div>
        </div>

        {/* =================================================
            AI DASHBOARD VISUAL
        ================================================= */}

        <div className={styles.heroVisual}>
          <div className={styles.orbit}></div>

          <div className={styles.aiCore}>
            <div className={styles.coreRing}></div>

            <div className={styles.coreContent}>
              <span>AI</span>
              <small>MATCHING</small>
            </div>
          </div>

          <div className={`${styles.floatingCard} ${styles.cardOne}`}>
            <span className={styles.cardIcon}>✦</span>
            <div>
              <small>AI Match</small>
              <strong>94%</strong>
            </div>
          </div>

          <div className={`${styles.floatingCard} ${styles.cardTwo}`}>
            <span className={styles.cardIcon}>✓</span>
            <div>
              <small>Skills Matched</small>
              <strong>12 / 14</strong>
            </div>
          </div>

          <div className={`${styles.floatingCard} ${styles.cardThree}`}>
            <span className={styles.cardIcon}>⚡</span>
            <div>
              <small>Candidate Status</small>
              <strong>Strong Match</strong>
            </div>
          </div>

          <div className={styles.matchPanel}>
            <div className={styles.panelHeader}>
              <div>
                <span>Candidate Analysis</span>
                <strong>AI Evaluation</strong>
              </div>

              <span className={styles.liveBadge}>LIVE</span>
            </div>

            <div className={styles.matchScore}>
              <div className={styles.scoreCircle}>
                <strong>94</strong>
                <span>%</span>
              </div>

              <div>
                <small>Overall Match</small>
                <strong>Excellent Candidate</strong>
              </div>
            </div>

            <div className={styles.skillList}>
              <div>
                <span>React.js</span>
                <b>✓</b>
              </div>

              <div>
                <span>Node.js</span>
                <b>✓</b>
              </div>

              <div>
                <span>SQL</span>
                <b>✓</b>
              </div>

              <div>
                <span>MongoDB</span>
                <b>✓</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MOVING AI STRIP
      ===================================================== */}

      <section className={styles.marqueeSection}>
        <div className={styles.marquee}>
          <span>AI MATCHING</span>
          <i>✦</i>
          <span>SMART SCREENING</span>
          <i>✦</i>
          <span>TALENT INTELLIGENCE</span>
          <i>✦</i>
          <span>FASTER HIRING</span>
          <i>✦</i>
          <span>AI MATCHING</span>
          <i>✦</i>
          <span>SMART SCREENING</span>
          <i>✦</i>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className={styles.intro}>
        <div className={styles.sectionTag}>WHY HIRENOVA</div>

        <h2>
          Recruitment shouldn't feel
          <br />
          <span>like searching in the dark.</span>
        </h2>

        <p>
          HireNova AI transforms raw applications into meaningful hiring
          intelligence so recruiters can focus on people instead of manually
          filtering hundreds of candidates.
        </p>
      </section>

      {/* =====================================================
          BENTO FEATURES
      ===================================================== */}

      <section className={styles.bentoSection}>
        <div className={styles.bentoGrid}>
          <div
            className={`${styles.bentoCard} ${styles.largeCard}`}
            onClick={() => navigate("/login")}
          >
            <div className={styles.bentoGlow}></div>

            <div className={styles.bentoTop}>
              <span className={styles.featureNumber}>01</span>
              <span className={styles.featureIcon}>✦</span>
            </div>

            <div className={styles.bentoContent}>
              <h3>AI Candidate Matching</h3>

              <p>
                Automatically evaluate candidate skills against the role and
                generate an intelligent match score.
              </p>

              <div className={styles.fakeScore}>
                <div>
                  <span>Candidate Match</span>
                  <strong>87%</strong>
                </div>

                <div className={styles.progress}>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bentoCard}>
            <div className={styles.bentoTop}>
              <span className={styles.featureNumber}>02</span>
              <span className={styles.featureIcon}>◎</span>
            </div>

            <h3>Smart Screening</h3>

            <p>
              Let AI identify relevant candidates without manually checking
              every application.
            </p>

            <div className={styles.scanAnimation}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className={styles.bentoCard}>
            <div className={styles.bentoTop}>
              <span className={styles.featureNumber}>03</span>
              <span className={styles.featureIcon}>⌁</span>
            </div>

            <h3>Hiring Intelligence</h3>

            <p>
              See matched skills, missing skills, experience match and AI
              explanations in one place.
            </p>

            <div className={styles.miniGraph}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className={`${styles.bentoCard} ${styles.wideCard}`}>
            <div>
              <div className={styles.bentoTop}>
                <span className={styles.featureNumber}>04</span>
                <span className={styles.featureIcon}>⚡</span>
              </div>

              <h3>Built for Modern Recruiters</h3>

              <p>
                From posting a job to evaluating applicants, HireNova keeps the
                complete hiring workflow connected.
              </p>
            </div>

            <div className={styles.workflowVisual}>
              <div>JOB</div>
              <span>→</span>
              <div>AI</div>
              <span>→</span>
              <div>MATCH</div>
              <span>→</span>
              <div>HIRE</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          AI MATCHING SHOWCASE
      ===================================================== */}

      <section className={styles.showcase}>
        <div className={styles.showcaseText}>
          <div className={styles.sectionTag}>THE AI ENGINE</div>

          <h2>
            From job title
            <br />
            to <span>perfect fit.</span>
          </h2>

          <p>
            Recruiters simply create a job. HireNova AI intelligently
            understands the role and evaluates each candidate based on the
            skills relevant to that position.
          </p>

          <div className={styles.checkList}>
            <div>
              <span>✓</span>
              Understands the job role
            </div>

            <div>
              <span>✓</span>
              Identifies relevant skills
            </div>

            <div>
              <span>✓</span>
              Calculates candidate match
            </div>

            <div>
              <span>✓</span>
              Explains the recommendation
            </div>
          </div>
        </div>

        <div className={styles.aiVisualization}>
          <div className={styles.visualGlow}></div>

          <div className={styles.roleNode}>
            <small>JOB ROLE</small>
            <strong>Full Stack Developer</strong>
          </div>

          <div className={styles.connectionLine}></div>

          <div className={styles.aiNode}>
            <span>AI</span>
          </div>

          <div className={styles.connectionLine}></div>

          <div className={styles.candidateNode}>
            <small>CANDIDATE</small>
            <strong>94% MATCH</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className={styles.process}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>SIMPLE WORKFLOW</div>

          <h2>
            Hiring, without
            <span> the busywork.</span>
          </h2>
        </div>

        <div className={styles.timeline}>
          <div className={styles.processItem}>
            <div className={styles.processNumber}>01</div>

            <div>
              <h3>Post a Job</h3>

              <p>Add your job title, company details and requirements.</p>
            </div>
          </div>

          <div className={styles.processItem}>
            <div className={styles.processNumber}>02</div>

            <div>
              <h3>Candidates Apply</h3>

              <p>Candidates submit their skills and application information.</p>
            </div>
          </div>

          <div className={styles.processItem}>
            <div className={styles.processNumber}>03</div>

            <div>
              <h3>AI Evaluates</h3>

              <p>HireNova analyzes role relevance, skills and candidate fit.</p>
            </div>
          </div>

          <div className={styles.processItem}>
            <div className={styles.processNumber}>04</div>

            <div>
              <h3>Hire Smarter</h3>

              <p>Recruiters instantly see the strongest candidates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className={styles.statsSection}>
        <div className={styles.stat}>
          <strong>10K+</strong>
          <span>Applications Ready</span>
        </div>

        <div className={styles.stat}>
          <strong>95%</strong>
          <span>AI Match Intelligence</span>
        </div>

        <div className={styles.stat}>
          <strong>24/7</strong>
          <span>Automated Screening</span>
        </div>

        <div className={styles.stat}>
          <strong>1M+</strong>
          <span>Candidate Signals</span>
        </div>
      </section>

      {/* =====================================================
          RECRUITER CTA
      ===================================================== */}

      <section className={styles.finalCta}>
        <div className={styles.ctaGlow}></div>

        <div className={styles.ctaContent}>
          <div className={styles.sectionTag}>READY TO HIRE?</div>

          <h2>
            Your next great hire
            <br />
            is <span>closer than you think.</span>
          </h2>

          <p>
            Let AI handle the matching. You focus on making the final decision.
          </p>

          <div className={styles.buttons}>
            <Link to="/register" className={styles.primaryBtn}>
              Start Hiring Free
              <span>→</span>
            </Link>

            <button
              className={styles.secondaryBtn}
              onClick={() => navigate("/login")}
            >
              View Dashboard
            </button>
          </div>
        </div>

        <div className={styles.ctaOrb}></div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className={styles.footer}>
        <div>
          <h3>
            HireNova<span> AI</span>
          </h3>

          <p>AI-powered recruitment intelligence.</p>
        </div>

        <div className={styles.footerRight}>
          <span>Smart Hiring</span>
          <span>AI Matching</span>
          <span>Talent Intelligence</span>
        </div>
      </footer>
    </div>
  );
}
