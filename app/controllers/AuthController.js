const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { alertMessage, alertStatus };

      res.render("auth/contents/index", { alert });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/login");
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      if (!user) {
        req.flash("alertMessage", `user not found`);
        req.flash("alertStatus", "danger");
        res.redirect("/login");
        return;
      }

      if (user.status !== "Y") {
        req.flash("alertMessage", `user not active yet`);
        req.flash("alertStatus", "danger");
        res.redirect("/login");
        return;
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        req.flash("alertMessage", `password invalid`);
        req.flash("alertStatus", "danger");
        res.redirect("/login");
        return;
      }

      const data = {
        id: user.id,
        name: user.name,
      };

      req.session.user = data;
      res.redirect("/");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/login");
    }
  },
  logout: async (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  },
};
