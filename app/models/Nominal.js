const mongoose = require("mongoose");

const nominalSchema = mongoose.Schema(
  {
    coinQty: {
      type: Number,
      default: 0,
    },
    coinName: {
      type: String,
      require: [true, "Coin name must be fill"],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nominal", nominalSchema);
