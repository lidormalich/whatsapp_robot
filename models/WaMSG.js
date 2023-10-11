const mongoose = require("mongoose");
// import mongoose from "mongoose";

const WaMSGSchema = mongoose.Schema({
  roll: {
    type: String,
    required: true,
  },
  res: {
    type: String,
    required: true,
  },
});

const WaMSG = mongoose.model("Sentence", WaMSGSchema);
module.exports = WaMSG;
