const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT = 10;

let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "email must be fill"],
    },
    password: {
      type: String,
      require: [true, "password must be fill"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
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
    avatar: { type: String },
    fileName: { type: String },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Player").countDocuments({ email: value });
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} has registered`
);

playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, SALT);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
