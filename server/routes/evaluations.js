const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { options, criteria } = req.body;
  if (!options || !criteria) {
    return res.status(400).json({ error: "Options and criteria are required" });
  }
  if (!Array.isArray(options) || !Array.isArray(criteria)) {
    return res
      .status(400)
      .json({ error: "Options and criteria must be arrays" });
  }
  if (criteria.length === 0) {
    return res.status(400).json({ error: "Add at least one criterion" });
  }
  if (options.length < 2) {
    return res.status(400).json({ error: "Add at least two options" });
  }
  const hasInvalidCriterion = criteria.some((criterion) => {
    return (
      typeof criterion.name !== "string" ||
      criterion.name.trim() === "" ||
      typeof criterion.weight !== "number" ||
      criterion.weight < 1 ||
      criterion.weight > 5
    );
  });
  if (hasInvalidCriterion) {
    return res.status(400).json({
      error: "Each criterion needs a name and a weight from 1 to 5",
    });
  }
  const hasInvalidOption = options.some((option) => {
    return (
      typeof option.title !== "string" ||
      option.title.trim() === "" ||
      !Array.isArray(option.scores) ||
      option.scores.length !== criteria.length ||
      option.scores.some((score) => {
        return (
          !criteria.some((criterion) => criterion._id === score.criterionId) ||
          typeof score.criterionId !== "string" ||
          score.criterionId.trim() === "" ||
          typeof score.value !== "number" ||
          score.value < 1 ||
          score.value > 5
        );
      })
    );
  });
  if (hasInvalidOption) {
    return res.status(400).json({
      error: "Each option needs a title and one valid score per criterion",
    });
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

module.exports = router;
