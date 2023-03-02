var express = require("express");
const transaction = require("../app/controllers/TransactionsController");
var router = express.Router();
const { isNotLogin } = require("../app/middlewares/auth");
/* GET users listing. */
router.use(isNotLogin);
router.get("/", transaction.index);
router.put("/status/:id", transaction.updateStatus);

module.exports = router;
