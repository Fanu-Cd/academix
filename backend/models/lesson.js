const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    uploadedBy: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
    course: { type: mongoose.Types.ObjectId, required: false, ref: "Course" },
    filePaths: [{ type: String, required: false }],
  },
  { collection: "Lesson", timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
