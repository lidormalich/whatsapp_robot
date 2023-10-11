const mongoose = require("mongoose");
// import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  number: {
    type: String,
  },
  lastMSG: {
    type: String,
  }, isAdmin: {
    type: Boolean,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
