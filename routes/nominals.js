const {
  nominalValidation,
  nominalGuard,
} = require("../app/helpers/validation");
const express = require("express");
const nominals = require("../app/controllers/NominalsController");
const router = express.Router();
const { isNotLogin } = require("../app/middlewares/auth");

/* GET users listing. */
router.use(isNotLogin);
router.get("/", nominals.index);
router.get("/create", nominals.create);
router.post("/", nominalValidation, nominalGuard, nominals.store);
router.get("/:id/edit", nominals.edit);
router.put("/:id", nominals.update);
router.delete("/:id", nominals.delete);

module.exports = router;
