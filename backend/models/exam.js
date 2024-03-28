const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    lesson: { type: mongoose.Types.ObjectId, required: false, ref: "Lesson" },
    filePaths: [{ type: String, required: false }],
  },
  { collection: "Exam", timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;
