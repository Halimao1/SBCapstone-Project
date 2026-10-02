function ResultsSection({ results, criteria }) {
  const maximumScore = criteria.reduce(
    (total, criterion) => total + criterion.weight * 5,
    0,
  );
  if (results.length === 0) {
    return (
      <div className="results-section">
        <h3>Results</h3>
        <p>
          Your ranked options will appear here after you calculate the results.
        </p>
      </div>
    );
  }

  const topScore = results[0].total;
  const hasTopTie = results.filter((result) => result.total === topScore).length > 1;

  return (
    <div className="results-section">
      <h3>Results</h3>
      {results.map((result, index) => {
        const percentage =
          maximumScore > 0
            ? Math.round((result.total / maximumScore) * 100)
            : 0;
        const isTopResult = result.total === topScore;

        return (
          <div key={index} className="result-row">
            <div className="result-summary">
              <strong className="title">
                #{index + 1} {result.title}
              </strong>
              {isTopResult && (
                <span className="winner-badge">
                  {hasTopTie ? "Tied for first" : "Recommended"}
                </span>
              )}
              <span className="percentage">{percentage}%</span>
            </div>
            <div className="result-bar-track" aria-hidden="true">
              <div
                className="result-bar-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <small>
              Weighted score: {result.total} out of {maximumScore}
            </small>
          </div>
        );
      })}
    </div>
  );
}

export default ResultsSection;
