const Transaction = require("../../app/models/Transaction");
const Vouchers = require("../../app/models/Voucher");
const Categories = require("../../app/models/Category");
const Player = require("../../app/models/Player");

const page_name = "home";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const transactions = await Transaction.countDocuments();
      const vouchers = await Vouchers.countDocuments();
      const categories = await Categories.countDocuments();
      const players = await Player.countDocuments();

      const alert = { alertMessage, alertStatus };

      res.render("./dashboard/content/index", {
        name: req.session.user.name,
        page_name,
        title: "Dashboard - Home",
        alert,
        transactions,
        vouchers,
        players,
        categories,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
};
