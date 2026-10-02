const mongoose = require("mongoose");

const decisionsSchema = new mongoose.Schema({
  title: String,
  description: String,
  criteria: [{ name: String, weight: Number }],
  options: [
    {
      title: String,
      scores: [{ criterionId: mongoose.Schema.Types.ObjectId, value: Number }],
    },
  ],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Decision = mongoose.model("Decision", decisionsSchema);
module.exports = Decision;
