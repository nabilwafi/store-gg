const Player = require("../models/Player");
const jwt = require("jsonwebtoken");
const config = require("../../config/index");

module.exports = {
  isNotLogin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash("alertMessage", "Session Expired");
      req.flash("alertStatus", "danger");
      res.redirect("/login");
      return;
    }

    next();
  },
  isLogin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      next();
    } else {
      res.redirect("/");
    }
  },
  isLoginPlayer: async (req, res, next) => {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null;

      const data = jwt.verify(token, config.JWTKEY);

      const player = await Player.findOne({ _id: data.player.id });
      if (!player) {
        throw new Error("player tidak ditemukan!");
      }

      req.player = player;
      req.token = token;
      next();
    } catch (error) {
      res.status(401).json({
        error: "Not Authorized to access this resource",
      });
    }
  },
};
