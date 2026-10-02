function SavedDecisions({ savedDecisions, loadDecision, deleteDecision }) {
  if (savedDecisions.length === 0) {
    return (
      <p className="empty-state">
        No saved decisions to display. Select &quot;Load Saved Decisions&quot; to
        check your account.
      </p>
    );
  }
  return (
    <div className="saved-decisions">
      {savedDecisions.map((decision) => (
        <div key={decision._id} className="saved-decision-row">
          <button
            className="secondary-button"
            type="button"
            onClick={() => loadDecision(decision)}
          >
            {decision.title}
          </button>
          <button
            className="danger-button"
            type="button"
            onClick={() => deleteDecision(decision._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default SavedDecisions;
