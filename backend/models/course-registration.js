const mongoose = require("mongoose");

const courseRegistration = new mongoose.Schema(
  {
    course: { type: mongoose.Types.ObjectId, required: true, ref: "Course" },
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    status: { type: String, required: false, default: "registered" },
  },
  { collection: "CourseRegistration", timestamps: true }
);

const CourseRegistration = mongoose.model(
  "CourseRegistration",
  courseRegistration
);
module.exports = CourseRegistration;
