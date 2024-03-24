const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    status: { type: String, required: false, default: "active" },
  },
  { collection: "Token" }
);

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
