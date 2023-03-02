const Category = require("../models/Category");

const page_name = "categories";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const categories = await Category.find();

      const alert = {
        alertMessage,
        alertStatus,
      };

      res.render("./dashboard/content/categories/index", {
        name: req.session.user.name,
        title: "Dashboard - Categories",
        page_name,
        categories,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/categories");
    }
  },
  create: async (req, res) => {
    try {
      res.render("./dashboard/content/categories/create", {
        name: req.session.user.name,
        title: "Dashboard - Categories",
        page_name,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/categories");
    }
  },
  store: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category({ name });
      await category.save();

      req.flash("alertMessage", "Successfully Create Category");
      req.flash("alertStatus", "success");

      res.redirect("/categories");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/categories");
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });

      res.render("./dashboard/content/categories/edit", {
        name: req.session.user.name,
        title: "Dashboard - Categories",
        category,
        page_name,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/categories");
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await Category.findOneAndUpdate({ _id: id }, { name });

      req.flash("alertMessage", "Successfully Updated Category");
      req.flash("alertStatus", "success");

      res.redirect("/categories");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/categories");
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Category.findOneAndDelete({ _id: id });
      res.json({
        status: 200,
        success: "success",
        data: { message: "Successfully Deleted Category" },
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/categories");
    }
  },
};
