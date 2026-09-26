import { useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [options, setOptions] = useState([]);
  const [results, setResults] = useState([]);

  const addCriterion = () => {
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
    setCriteria((previousCriteria) => {
      return previousCriteria.map((criterion) => {
        if (criterion._id === id) {
          return { ...criterion, weight: newWeight };
        }
        return criterion;
      });
    });
  };

  const addOption = () => {
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
    setOptions((previousOptions) => {
      return previousOptions.map((option) => {
        if (option._id === id) {
          return { ...option, title: newTitle };
        }
        return option;
      });
    });
  };

  const updateScore = (optionId, criterionId, newValue) => {
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
    const response = await fetch("/api/evaluations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ options, criteria }),
    });
    const data = await response.json();
    setResults(data.results);
  };

  return (
    <main>
      <h1>Decision Evaluator</h1>
      <label htmlFor="decision-title">Decision title</label>
      <input
        type="text"
        id="decision-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="button" onClick={addCriterion}>
        Add criterion
      </button>
      {criteria.map((criterion) => (
        <div key={criterion._id}>
          <input
            type="text"
            value={criterion.name}
            onChange={(e) => updateCriterionName(criterion._id, e.target.value)}
          />
          <input
            type="number"
            min="1"
            max="5"
            value={criterion.weight}
            onChange={(e) =>
              updateCriterionWeight(criterion._id, Number(e.target.value))
            }
          />
        </div>
      ))}
      <button type="button" onClick={addOption}>
        Add option
      </button>
      {options.map((option) => (
        <div key={option._id}>
          <input
            type="text"
            value={option.title}
            onChange={(e) => updateOptionTitle(option._id, e.target.value)}
          />
          {option.scores.map((score) => (
            <div key={score.criterionId}>
              <span>
                {
                  criteria.find(
                    (criterion) => criterion._id === score.criterionId,
                  )?.name
                }
                :{" "}
                <input
                  type="number"
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
              </span>
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={checkDecision}>
        Check Decision
      </button>
      {results.map((result, index) => (
        <div key={index}>
          <span className="title">{result.title}</span>
          <span className="total">{result.total}</span>
        </div>
      ))}
    </main>
  );
}

export default App;
