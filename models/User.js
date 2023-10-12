const mongoose = require("mongoose");
// import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  lastMSG: {
    type: String,
  }, isAdmin: {
    type: Boolean,
  }, isHadran: {
    type: Boolean,
  }, isBlock: {
    type: Boolean,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
