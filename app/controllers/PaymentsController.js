const Payment = require("../models/Payment");
const Bank = require("../models/Bank");

const page_name = "payments";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const payments = await Payment.find().populate({
        path: "banks",
        populate: {
          path: "nameBank",
        },
      });

      const alert = { alertMessage, alertStatus };

      res.render("./dashboard/content/payments/index", {
        name: req.session.user.name,
        title: "Dashboard - Payments",
        page_name,
        payments,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payments");
    }
  },
  create: async (req, res) => {
    try {
      const banks = await Bank.find().populate("nameBank");

      res.render("./dashboard/content/payments/create", {
        name: req.session.user.name,
        title: "Dashboard - Payments",
        banks,
        page_name,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payments");
    }
  },
  store: async (req, res) => {
    try {
      const { type, banks } = req.body;
      const payment = await Payment({ type, banks });
      await payment.save();

      req.flash("alertMessage", "Successfully Create Payments");
      req.flash("alertStatus", "success");

      res.redirect("/payments");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payments");
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({ _id: id });
      const banks = await Bank.find().populate("nameBank");

      res.render("./dashboard/content/payments/edit", {
        name: req.session.user.name,
        title: "Dashboard - Payments",
        payment,
        banks,
        page_name,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payments");
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, banks } = req.body;

      await Payment.findOneAndUpdate({ _id: id }, { type, banks });

      req.flash("alertMessage", "Successfully Updated Payment");
      req.flash("alertStatus", "success");

      res.redirect("/payments");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payments");
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Payment.findOneAndDelete({ _id: id });
      res.json({
        status: 200,
        success: "success",
        data: { message: "Successfully Deleted Payment" },
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payments");
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({ _id: id });
      let status = payment.status === "Y" ? "N" : "Y";

      await Payment.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertMessage", `Successfully Update Status Payment`);
      req.flash("alertStatus", "success");
      res.redirect("/payments");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payments");
    }
  },
};
