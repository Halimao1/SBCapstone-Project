import { useEffect, useState } from "react";
import AuthSection from "./components/AuthSection";
import CriteriaSection from "./components/CriteriaSection";
import OptionsSection from "./components/OptionsSection";
import ResultsSection from "./components/ResultsSection";
import SavedDecisions from "./components/SavedDecisions";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [options, setOptions] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [savedDecisions, setSavedDecisions] = useState([]);
  const [isFetchingDecisions, setIsFetchingDecisions] = useState(false);
  const [selectedDecisionId, setSelectedDecisionId] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  const clearDecisionFeedback = () => {
    setResults([]);
    setError("");
    setMessage("");
  };

  const addCriterion = () => {
    clearDecisionFeedback();
    const newCriterion = {
      _id: crypto.randomUUID(),
      name: "",
      weight: 1,
    };
    setCriteria((previousCriteria) => [...previousCriteria, newCriterion]);
    setOptions((previousOptions) =>
      previousOptions.map((option) => ({
        ...option,
        scores: [...option.scores, { criterionId: newCriterion._id, value: 3 }],
      })),
    );
  };
  const updateCriterionName = (id, newName) => {
    clearDecisionFeedback();
    setCriteria((previousCriteria) => {
      return previousCriteria.map((criterion) => {
        if (criterion._id === id) {
          return { ...criterion, name: newName };
        }
        return criterion;
      });
    });
  };

  const updateCriterionWeight = (id, newWeight) => {
    clearDecisionFeedback();
    setCriteria((previousCriteria) => {
      return previousCriteria.map((criterion) => {
        if (criterion._id === id) {
          return { ...criterion, weight: newWeight };
        }
        return criterion;
      });
    });
  };

  const removeCriterion = (id) => {
    clearDecisionFeedback();
    setCriteria((previousCriteria) =>
      previousCriteria.filter((criterion) => criterion._id !== id),
    );
    setOptions((previousOptions) =>
      previousOptions.map((option) => ({
        ...option,
        scores: option.scores.filter((score) => score.criterionId !== id),
      })),
    );
  };

  const addOption = () => {
    clearDecisionFeedback();
    const newOption = {
      _id: crypto.randomUUID(),
      title: "",
      scores: criteria.map((criterion) => ({
        criterionId: criterion._id,
        value: 3,
      })),
    };
    setOptions((previousOptions) => [...previousOptions, newOption]);
  };

  const updateOptionTitle = (id, newTitle) => {
    clearDecisionFeedback();
    setOptions((previousOptions) => {
      return previousOptions.map((option) => {
        if (option._id === id) {
          return { ...option, title: newTitle };
        }
        return option;
      });
    });
  };

  const removeOption = (id) => {
    clearDecisionFeedback();
    setOptions((previousOptions) =>
      previousOptions.filter((option) => option._id !== id),
    );
  };

  const updateScore = (optionId, criterionId, newValue) => {
    clearDecisionFeedback();
    setOptions((previousOptions) => {
      return previousOptions.map((option) => {
        if (option._id === optionId) {
          return {
            ...option,
            scores: option.scores.map((score) => {
              if (score.criterionId === criterionId) {
                return { ...score, value: newValue };
              }
              return score;
            }),
          };
        }
        return option;
      });
    });
  };

  const checkDecision = async () => {
    setError("");
    setResults([]);
    setIsLoading(true);
    try {
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ options, criteria }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to check decision");
      }
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDecision = async () => {
    setError("");
    setIsSaving(true);
    setMessage("");
    try {
      const method = selectedDecisionId ? "PUT" : "POST";
      const url = selectedDecisionId
        ? `/api/decisions/${selectedDecisionId}`
        : "/api/decisions";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, criteria, options }),
      });
      const savedDecision = await response.json();
      if (!response.ok) {
        throw new Error(savedDecision.error || "Failed to save decision");
      }
      setSelectedDecisionId(savedDecision._id);
      setMessage("Decision saved successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchDecisions = async () => {
    setError("");
    setIsFetchingDecisions(true);
    try {
      const response = await fetch("/api/decisions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch decisions");
      }
      const data = await response.json();
      setSavedDecisions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetchingDecisions(false);
    }
  };

  const deleteDecision = async (id) => {
    setError("");
    try {
      const response = await fetch(`/api/decisions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete decision");
      }
      setSavedDecisions((prevDecisions) =>
        prevDecisions.filter((decision) => decision._id !== id),
      );
      if (selectedDecisionId === id) {
        startNewDecision();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAuth = async (action) => {
    setMessage("");
    setAuthError("");
    try {
      const response = await fetch(`/api/auth/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }
      setUser(data.user);
      setPassword("");
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    setAuthError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUser(null);
      setSavedDecisions([]);
      startNewDecision();
      setMessage(data.message);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const loadDecision = (decision) => {
    setSelectedDecisionId(decision._id);
    setTitle(decision.title);
    setCriteria(decision.criteria);
    setOptions(decision.options);
    setResults([]);
    setError("");
    setMessage("");
  };

  const startNewDecision = () => {
    setSelectedDecisionId(null);
    setTitle("");
    setCriteria([]);
    setOptions([]);
    setResults([]);
    setError("");
    setMessage("");
  };

  return (
    <main className="app">
      <h1>Decision Evaluator</h1>

      <section className="instructions-panel">
        <h2>How it works</h2>
        <p>Compare choices using the factors that matter most to you.</p>
        <ol>
          <li>
            Name your decision and add criteria (the factors you care about),
            such as price, location, or quality.
          </li>
          <li>
            Set each criterion's importance from 1 (low importance) to 5 (very
            important).
          </li>
          <li>
            Add at least two options and score each one from 1 (poor) to 5
            (excellent).
          </li>
          <li>Calculate the ranking and save your comparison for later.</li>
        </ol>
      </section>

      <AuthSection
        user={user}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleAuth={handleAuth}
        handleLogout={handleLogout}
      />
      {authError && (
        <p className="error" role="alert">
          {authError}
        </p>
      )}
      {message && (
        <p className="message" role="status">
          {message}
        </p>
      )}
      <section className="decision-workspace">
        <h2>Build your comparison</h2>
        <p>Start by naming the choice you are trying to make.</p>
        <label htmlFor="decision-title">Decision title</label>
        <input
          type="text"
          id="decision-title"
          value={title}
          placeholder="Example: Which apartment should I choose?"
          onChange={(e) => setTitle(e.target.value)}
        />
        <CriteriaSection
          criteria={criteria}
          addCriterion={addCriterion}
          updateCriterionName={updateCriterionName}
          updateCriterionWeight={updateCriterionWeight}
          removeCriterion={removeCriterion}
        />
        <OptionsSection
          options={options}
          addOption={addOption}
          updateOptionTitle={updateOptionTitle}
          updateScore={updateScore}
          criteria={criteria}
          removeOption={removeOption}
        />
        <h3>3. Calculate your ranking</h3>
        <p>
          Calculate the weighted results, then save your comparison for later.
        </p>

        <div className="decision-actions">
          <button type="button" onClick={checkDecision} disabled={isLoading}>
            {isLoading ? "Calculating..." : "Calculate Ranking"}
          </button>
          {user ? (
            <button type="button" onClick={saveDecision} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Decision"}
            </button>
          ) : (
            <p className="save-prompt">
              Sign in or register above to save this comparison.
            </p>
          )}
          <button
            className="secondary-button"
            type="button"
            onClick={startNewDecision}
          >
            New Decision
          </button>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <ResultsSection results={results} criteria={criteria} />
        {user && (
          <div className="saved-section">
            <h3>Saved decisions</h3>
            <p>Load a previous comparison or delete one you no longer need.</p>
            <button
              className="secondary-button"
              type="button"
              onClick={fetchDecisions}
              disabled={isFetchingDecisions}
            >
              {isFetchingDecisions ? "Loading..." : "Load Saved Decisions"}
            </button>
            <SavedDecisions
              savedDecisions={savedDecisions}
              loadDecision={loadDecision}
              deleteDecision={deleteDecision}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
