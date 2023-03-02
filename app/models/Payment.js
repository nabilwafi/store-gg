const mongoose = require("mongoose");

let PaymentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      require: [true, "type payment must be fill"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    banks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
