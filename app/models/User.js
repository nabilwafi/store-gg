const mongoose = require("mongoose");

let UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "email must be fill"],
    },
    name: {
      type: String,
      require: [true, "name must be fill"],
    },
    password: {
      type: String,
      require: [true, "password must be fill"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    username: {
      type: String,
      require: [true, "username must be fill"],
    },
    name: {
      type: String,
      require: [true, "name must be fill"],
    },
    phoneNumber: {
      type: String,
      require: [true, "phone number must be fill"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
