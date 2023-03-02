const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
