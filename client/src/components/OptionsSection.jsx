function OptionsSection({
  options,
  addOption,
  updateOptionTitle,
  updateScore,
  criteria,
  removeOption,
}) {
  return (
    <div className="options-section">
      <h3>2. Add your options</h3>
      <p>Add at least two choices, then score each one for every criterion.</p>
      <button type="button" onClick={addOption}>
        Add option
      </button>
      <small>Scores: 1 = poor, 5 = excellent.</small>
      {options.map((option) => (
        <div key={option._id} className="option-card">
          <label htmlFor={`option-title-${option._id}`}>Option name</label>
          <input
            type="text"
            id={`option-title-${option._id}`}
            value={option.title}
            placeholder="Example: Downtown apartment"
            onChange={(e) => updateOptionTitle(option._id, e.target.value)}
          />
          {option.scores.map((score) => (
            <div key={score.criterionId} className="score-row">
              <label htmlFor={`score-${option._id}-${score.criterionId}`}>
                {criteria.find(
                  (criterion) => criterion._id === score.criterionId,
                )?.name || "Criterion"}{" "}
                score
              </label>
              <input
                type="number"
                id={`score-${option._id}-${score.criterionId}`}
                min="1"
                max="5"
                value={score.value}
                onChange={(e) =>
                  updateScore(
                    option._id,
                    score.criterionId,
                    Number(e.target.value),
                  )
                }
              />
            </div>
          ))}
          <button
            className="danger-button"
            type="button"
            onClick={() => removeOption(option._id)}
          >
            Remove option
          </button>
        </div>
      ))}
    </div>
  );
}

export default OptionsSection;
