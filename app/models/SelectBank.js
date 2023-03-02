const mongoose = require("mongoose");

const SelectBankSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "name must be fill"],
  },
});

module.exports = mongoose.model("SelectBank", SelectBankSchema);
