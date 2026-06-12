function Home() {
  return (
    <>
      <div className="hero-section">
        <h1>🛡️ INSUREVISION</h1>

        <h2>AI Insurance Recommendation System</h2>

        <p className="tagline">
          Smart Protection Starts with Smart Decisions
        </p>

        <p className="subtitle">
          Analyze Risk • Measure Readiness • Identify Coverage Gaps
        </p>

        <button
          onClick={() => window.location.href = "/ai"}
        >
          Get Started
        </button>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🤖 AI Recommendation</h3>
          <p>Personalized insurance suggestions.</p>
        </div>

        <div className="feature-card">
          <h3>📊 Risk Analysis</h3>
          <p>Evaluate risk instantly.</p>
        </div>

        <div className="feature-card">
          <h3>🛡 Coverage Gap Analysis</h3>
          <p>Identify underinsurance.</p>
        </div>

        <div className="feature-card">
          <h3>📈 Insurance Readiness</h3>
          <p>Measure preparedness level.</p>
        </div>
      </div>

      <div className="insurance-types">
        <h2>Insurance Solutions We Offer</h2>

        <div className="insurance-grid">

          <div className="insurance-card">
            <h1>❤️</h1>
            <h3>Health Insurance</h3>
            <p>
              Medical expense protection and healthcare coverage.
            </p>
          </div>

          <div className="insurance-card">
            <h1>💼</h1>
            <h3>Life Insurance</h3>
            <p>
              Financial security and family protection plans.
            </p>
          </div>

          <div className="insurance-card">
            <h1>🚗</h1>
            <h3>Vehicle Insurance</h3>
            <p>
              Coverage for cars, bikes and accidents.
            </p>
          </div>

          <div className="insurance-card">
            <h1>✈️</h1>
            <h3>Travel Insurance</h3>
            <p>
              Travel protection against emergencies and delays.
            </p>
          </div>

          <div className="insurance-card">
            <h1>🏠</h1>
            <h3>Home Insurance</h3>
            <p>
              Protection for property and valuable assets.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default Home;