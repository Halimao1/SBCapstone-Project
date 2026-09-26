const express = require("express");
const app = express();
app.use(express.json());
app.post("/api/evaluations", (req, res) => {
  const { options, criteria } = req.body;
  if (!options || !criteria) {
    return res.status(400).json({ error: "Options and criteria are required" });
  }
  if (!Array.isArray(options) || !Array.isArray(criteria)) {
    return res
      .status(400)
      .json({ error: "Options and criteria must be arrays" });
  }
  if (!options.every((option) => Array.isArray(option.scores))) {
    return res
      .status(400)
      .json({ error: "Each option must have a scores array" });
  }
  const validCriterionIds = options.every((option) =>
    option.scores.every((score) =>
      criteria.some((criterion) => criterion._id === score.criterionId),
    ),
  );
  if (!validCriterionIds) {
    return res
      .status(400)
      .json({ error: "Each score must reference a valid criterion ID" });
  }
  const results = options.map((option) => {
    const contributions = option.scores.map((score) => {
      const criterion = criteria.find(
        (criterion) => criterion._id === score.criterionId,
      );
      return score.value * criterion.weight;
    });
    const total = contributions.reduce((acc, curr) => acc + curr, 0);
    return { title: option.title, total };
  });
  results.sort((a, b) => b.total - a.total);
  return res.json({ results });
});
app.get("/api/health", (req, res) => {
  return res.json({ message: "API is running" });
});
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
