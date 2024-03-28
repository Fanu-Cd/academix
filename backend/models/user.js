const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    department: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Department",
    },
    grade: { type: String, required: false },
    account_status: { type: String, required: true, default: "not-approved" },
    school: { type: String, required: false, default: "AcademiX" },
  },
  { collection: "User" }
);

const Data = mongoose.model("User", userSchema);
module.exports = Data;
