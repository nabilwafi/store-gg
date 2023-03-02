const Transaction = require("../models/Transaction");
const page_name = "transactions";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const transactions = await Transaction.find().populate("player");

      const alert = { alertMessage, alertStatus };

      res.render("./dashboard/content/transactions/index", {
        name: req.session.user.name,
        title: "Dashboard - Transaction",
        alert,
        page_name,
        transactions,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/transactions");
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;

      await Transaction.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertMessage", `Successfully Update Status Transaction`);
      req.flash("alertStatus", "success");
      res.redirect("/transactions");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/transactions");
    }
  },
};
