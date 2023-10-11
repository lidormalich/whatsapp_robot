const mongoose = require("mongoose");
// import mongoose from "mongoose";

const HadranModelSchema = mongoose.Schema({
  model: {
    type: String,
  },
  name: {
    type: String,
  },
  support: {
    type: Boolean,
    required: true,
  },
  sw: {
    type: String,
    required: true,
  },
});

const HadranModel = mongoose.model("HadranModel", HadranModelSchema);
module.exports = HadranModel;
