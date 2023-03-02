const express = require("express");
const vouchers = require("../app/controllers/VouchersController");
const router = express.Router();
const multer = require("multer");
const os = require("os");
const { isNotLogin } = require("../app/middlewares/auth");

/* GET users listing. */
router.use(isNotLogin);
router.get("/", vouchers.index);
router.get("/create", vouchers.create);
router.post(
  "/",
  multer({ dest: os.tmpdir() }).single("thumbnail"),
  vouchers.store
);
router.get("/:id/edit", vouchers.edit);
router.put(
  "/:id",
  multer({ dest: os.tmpdir() }).single("thumbnail"),
  vouchers.update
);
router.delete("/:id", vouchers.delete);
router.put("/:id/update-status", vouchers.updateStatus);

module.exports = router;
