var express = require("express");
const payments = require("../app/controllers/PaymentsController");
var router = express.Router();
const { isNotLogin } = require("../app/middlewares/auth");

/* GET users listing. */
router.use(isNotLogin);
router.get("/", payments.index);
router.get("/create", payments.create);
router.post("/", payments.store);
router.get("/:id/edit", payments.edit);
router.put("/:id", payments.update);
router.delete("/:id", payments.delete);
router.put("/:id/update-status", payments.updateStatus);

module.exports = router;
