const Nominal = require("../models/Nominal");
const page_name = "nominals";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const nominals = await Nominal.find();

      const alert = { alertMessage, alertStatus };

      res.render("./dashboard/content/nominals/index", {
        name: req.session.user.name,
        title: "Dashboard - Nominals",
        page_name,
        nominals,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominals");
    }
  },
  create: async (req, res) => {
    try {
      res.render("./dashboard/content/nominals/create", {
        name: req.session.user.name,
        title: "Dashboard - Nominals",
        page_name,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominals");
    }
  },
  store: async (req, res) => {
    try {
      const { coinQty, coinName, price } = req.body;
      const nominal = await Nominal({ coinQty, coinName, price });
      await nominal.save();

      req.flash("alertMessage", "Successfully Create Nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominals");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominals");
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const nominal = await Nominal.findOne({ _id: id });

      res.render("./dashboard/content/nominals/edit", {
        name: req.session.user.name,
        title: "Dashboard - Nominals",
        page_name,
        nominal,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominals");
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { coinQty, coinName, price } = req.body;

      await Nominal.findOneAndUpdate({ _id: id }, { coinQty, coinName, price });

      req.flash("alertMessage", "Successfully Updated Nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominals");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominals");
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await Nominal.findOneAndDelete({ _id: id });

      res.json({
        status: 200,
        success: "success",
        data: { message: "Successfully Deleted Nominal" },
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominals");
    }
  },
};
