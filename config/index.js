const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  SERVERNAME: process.env.SERVERNAME,
  DBLINK: process.env.DBLINK,
  SECRETSESSION: process.env.SECRET_SESSION,
  JWTKEY: process.env.SECRET_JWT,
};
