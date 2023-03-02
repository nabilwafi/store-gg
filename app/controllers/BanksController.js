const Bank = require("../models/Bank");
const SelectBank = require("../models/SelectBank");

const page_name = "banks";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const banks = await Bank.find().populate("nameBank");

      const alert = { alertMessage, alertStatus };

      res.render("./dashboard/content/banks/index", {
        name: req.session.user.name,
        title: "Dashboard - Banks",
        page_name,
        banks,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/banks");
    }
  },
  create: async (req, res) => {
    try {
      const selectBanks = await SelectBank.find();

      res.render("./dashboard/content/banks/create", {
        name: req.session.user.name,
        title: "Dashboard - Banks",
        selectBanks,
        page_name,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/banks");
    }
  },
  store: async (req, res) => {
    try {
      const { name, nameBank, accountNumber } = req.body;
      const bank = await Bank({ name, nameBank, accountNumber });
      await bank.save();

      req.flash("alertMessage", "Successfully Create Bank");
      req.flash("alertStatus", "success");

      res.redirect("/banks");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/banks");
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      const selectBanks = await SelectBank.find();

      res.render("./dashboard/content/banks/edit", {
        name: req.session.user.name,
        title: "Dashboard - Banks",
        selectBanks,
        bank,
        page_name,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/banks");
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, nameBank, accountNumber } = req.body;

      await Bank.findOneAndUpdate(
        { _id: id },
        { name, nameBank, accountNumber }
      );

      req.flash("alertMessage", "Successfully Updated Bank");
      req.flash("alertStatus", "success");

      res.redirect("/banks");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/banks");
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Bank.findOneAndDelete({ _id: id });
      res.json({
        status: 200,
        success: "success",
        data: { message: "Successfully Deleted Bank" },
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/banks");
    }
  },
};
