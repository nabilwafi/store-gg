const mongoose = require("mongoose");
const { DBLINK } = require("../config/index");

mongoose.set("strictQuery", false);
mongoose.connect(DBLINK);

const db = mongoose.connection;

module.exports = db;
