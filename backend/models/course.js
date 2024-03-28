const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    id: { type: String, required: true },
    department: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Department",
    },
    teachers: [
      { type: mongoose.Types.ObjectId, ref: "Teacher", required: false },
    ],
    status: { type: String, required: false, default: "not-open" },
  },
  { collection: "Course" }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
