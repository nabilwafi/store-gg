const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: { type: String, require: [true, "game name must be fill"] },
      category: { type: String, require: [true, "category must be fill"] },
      thumbnail: { type: String },
      coinName: { type: String, require: [true, "coin name must be fill"] },
      coinQuantity: {
        type: String,
        require: [true, "coin quantity must be fill"],
      },
      price: { type: String },
    },
    historyPayment: {
      name: { type: String, require: [true, "name must be fill"] },
      type: { type: String, require: [true, "type must be fill"] },
      bankName: { type: String, require: [true, "bank name must be fill"] },
      accountNumber: {
        type: String,
        require: [true, "account number must be fill"],
      },
    },
    name: {
      type: String,
      require: [true, "name must be fill"],
      maxlength: [255, "name length must be 3 - 225 characters"],
      minlength: [3, "name length must be 3 - 225 characters"],
    },
    accountUser: {
      type: String,
      require: [true, "name must be fill"],
      maxlength: [255, "name length must be 3 - 225 characters"],
      minlength: [3, "name length must be 3 - 225 characters"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Failed", "Success"],
      default: "Pending",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    historyUser: {
      name: { type: String, require: [true, "Name user must be fill"] },
      phoneNumber: {
        type: Number,
        require: [true, "phone number must be fill"],
        maxlength: [13, "phone number must be fill 9 - 13 character"],
        minlength: [9, "phone number must be fill 9 - 13 character"],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
