const mongoose = require("mongoose");

const studentNoteSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    content: { type: String, required: false },
  },
  { collection: "StudentNote", timestamps: true }
);

const StudentNote = mongoose.model("StudentNote", studentNoteSchema);
module.exports = StudentNote;
