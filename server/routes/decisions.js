const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Decision = require("../models/Decision");
const requireAuth = require("../middleware/requireAuth");

router.post("/", requireAuth, async (req, res) => {
  const { title, description, criteria, options } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  if (!Array.isArray(criteria) || criteria.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one criterion is required" });
  }
  if (!Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: "At least two options are required" });
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

  try {
    const criterionMap = new Map();
    const savedCriteria = criteria.map((criterion) => {
      const newId = new mongoose.Types.ObjectId();
      criterionMap.set(criterion._id, newId);
      return { ...criterion, _id: newId };
    });
    const savedOptions = options.map((option) => {
      return {
        title: option.title,
        scores: option.scores.map((score) => ({
          criterionId: criterionMap.get(score.criterionId),
          value: score.value,
        })),
      };
    });
    const decision = await Decision.create({
      title,
      description,
      criteria: savedCriteria,
      options: savedOptions,
      ownerId: req.userId,
    });
    return res.status(201).json(decision);
  } catch {
    return res.status(500).json({ error: "Could not save decision" });
  }
});
router.get("/", requireAuth, async (req, res) => {
  try {
    const decisions = await Decision.find({ ownerId: req.userId });
    return res.json(decisions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not load decisions" });
  }
});
router.put("/:id", requireAuth, async (req, res) => {
  const { title, description, criteria, options } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  if (!Array.isArray(criteria) || criteria.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one criterion is required" });
  }
  if (!Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: "At least two options are required" });
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
  try {
    const criterionMap = new Map();
    const savedCriteria = criteria.map((criterion) => {
      const newId = new mongoose.Types.ObjectId();
      criterionMap.set(criterion._id, newId);
      return { ...criterion, _id: newId };
    });
    const savedOptions = options.map((option) => {
      return {
        title: option.title,
        scores: option.scores.map((score) => ({
          criterionId: criterionMap.get(score.criterionId),
          value: score.value,
        })),
      };
    });
    const decision = await Decision.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.userId,
      },
      {
        title,
        description,
        criteria: savedCriteria,
        options: savedOptions,
      },
      { new: true, runValidators: true },
    );
    if (!decision) {
      return res.status(404).json({ error: "Decision not found" });
    }
    return res.json(decision);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not update decision" });
  }
});
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const decision = await Decision.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.userId,
    });
    if (!decision) {
      return res.status(404).json({ error: "Decision not found" });
    }
    return res.json({ message: "Decision deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not delete decision" });
  }
});

module.exports = router;
