var express = require("express");
const router = express.Router();
const home = require("../app/controllers/HomeController");
const categoriesRouter = require("../routes/categories");
const nominalsRouter = require("../routes/nominals");
const vouchersRouter = require("../routes/vouchers");
const banksRouter = require("../routes/banks");
const paymentsRouter = require("../routes/payments");
const transactionRouter = require("../routes/transactions");
const { isNotLogin } = require("../app/middlewares/auth");

/* GET home page. */
router.get("/", isNotLogin, home.index);
router.use("/categories", categoriesRouter);
router.use("/nominals", nominalsRouter);
router.use("/vouchers", vouchersRouter);
router.use("/banks", banksRouter);
router.use("/payments", paymentsRouter);
router.use("/transactions", transactionRouter);

module.exports = router;
