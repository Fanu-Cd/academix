const mongoose = require("mongoose");

const studentActivitySchema = new mongoose.Schema(
  {
    student: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
    course: { type: mongoose.Types.ObjectId, required: false, ref: "Course" },
    lesson: { type: mongoose.Types.ObjectId, required: false, ref: "Lesson" },
    notes: [{ type: mongoose.Types.ObjectId, required: false, ref: "Note" }],
    filePaths: [{ type: String, required: false }],
  },
  { collection: "StudentActivity", timestamps: true }
);

const StudentActivity = mongoose.model(
  "StudentActivity",
  studentActivitySchema
);
module.exports = StudentActivity;
