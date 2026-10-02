function CriteriaSection({
  criteria,
  addCriterion,
  updateCriterionName,
  updateCriterionWeight,
  removeCriterion,
}) {
  return (
    <div className="criteria-section">
      <h3>1. Choose your criteria</h3>
      <p>Criteria are the factors you will use to compare your options.</p>

      <button type="button" onClick={addCriterion}>
        Add criterion
      </button>

      {criteria.map((criterion) => (
        <div key={criterion._id} className="field-row">
          <div className="field-group">
            <label htmlFor={`criterion-name-${criterion._id}`}>
              Criterion name
            </label>
            <input
              type="text"
              id={`criterion-name-${criterion._id}`}
              value={criterion.name}
              placeholder="Example: Monthly cost"
              onChange={(e) =>
                updateCriterionName(criterion._id, e.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label htmlFor={`criterion-weight-${criterion._id}`}>
              Importance
            </label>
            <input
              type="number"
              id={`criterion-weight-${criterion._id}`}
              min="1"
              max="5"
              value={criterion.weight}
              onChange={(e) =>
                updateCriterionWeight(criterion._id, Number(e.target.value))
              }
            />
            <small>1 = low importance, 5 = very important</small>
          </div>
          <button
            className="danger-button"
            type="button"
            onClick={() => removeCriterion(criterion._id)}
          >
            Remove criterion
          </button>
        </div>
      ))}
    </div>
  );
}

export default CriteriaSection;
