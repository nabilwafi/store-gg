var express = require("express");
const auths = require("../../app/controllers/api/AuthController");
const router = express.Router();
const multer = require("multer");
const os = require("os");
const { isLoginPlayer } = require("../../app/middlewares/auth");

/* GET users listing. */
router.post(
  "/signup",
  multer({ dest: os.tmpdir() }).single("avatar"),
  auths.signup
);
router.post("/signin", auths.signin);
router.post("/checkout", isLoginPlayer, auths.checkout);
router.get("/history", isLoginPlayer, auths.history);
router.get("/history/:id/detail", isLoginPlayer, auths.historyDetail);
router.get("/dashboard", isLoginPlayer, auths.dashboard);
router.get("/profile", isLoginPlayer, auths.getProfile);
router.put(
  "/profile",
  isLoginPlayer,
  multer({ dest: os.tmpdir() }).single("avatar"),
  auths.editProfile
);

module.exports = router;
