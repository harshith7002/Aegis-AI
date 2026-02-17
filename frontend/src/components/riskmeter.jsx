import "../styles/layout.css";

export default function RiskMeter({ score }) {
  const tier =
    score >= 75 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";

  return (
    <div className="risk-box">
      <div className="risk-top">
        <h3>Risk Score</h3>
        <span className={`tier ${tier}`}>{tier}</span>
      </div>

      <div className="meter">
        <div className="fill" style={{ width: `${score}%` }} />
      </div>

      <div className="risk-score">{score}%</div>
    </div>
  );
}
