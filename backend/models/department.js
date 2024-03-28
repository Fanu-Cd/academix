const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { collection: "Department" }
);

const Data = mongoose.model("Department", departmentSchema);
module.exports = Data;
