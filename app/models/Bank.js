const mongoose = require("mongoose");

let BankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name must be fill with your name"],
    },
    nameBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SelectBank",
    },
    accountNumber: {
      type: Number,
      require: [true, "Number of rekening must be fill with numbers"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bank", BankSchema);
