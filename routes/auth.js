const { isLogin } = require("../app/middlewares/auth");
var express = require("express");
const auth = require("../app/controllers/AuthController");
const router = express();

/* GET users listing. */
router.set("layout", "auth/template");
router.get("/login", isLogin, auth.index);
router.post("/login", isLogin, auth.login);
router.get("/logout", auth.logout);

module.exports = router;
