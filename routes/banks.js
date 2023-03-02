var express = require("express");
const banks = require("../app/controllers/BanksController");
var router = express.Router();
const { isNotLogin } = require("../app/middlewares/auth");

/* GET users listing. */
router.use(isNotLogin);
router.get("/", banks.index);
router.get("/create", banks.create);
router.post("/", banks.store);
router.get("/:id/edit", banks.edit);
router.put("/:id", banks.update);
router.delete("/:id", banks.delete);

module.exports = router;
