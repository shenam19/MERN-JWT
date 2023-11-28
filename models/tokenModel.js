const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const tokenSchema = new Schema(
  {
    userid: {
      type: String,
      trim: true,
      required: true,
    },
    token: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Token = mongoose.model("token", tokenSchema);
module.exports = Token;
