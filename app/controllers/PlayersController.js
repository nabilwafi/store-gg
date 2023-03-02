const Voucher = require("../models/Voucher");
const Player = require("../models/Player");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");

module.exports = {
  landingpage: async (req, res) => {
    try {
      const vouchers = await Voucher.find()
        .select("_id name categories status thumbnail")
        .populate("categories");

      res.status(200).json({ data: vouchers });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Intenal Server Error" });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findOne({ _id: id })
        .populate("categories")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");

      if (!voucher) {
        return res.status(404).json({ message: "Voucher game not found" });
      }

      res.status(200).json({ data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Intenal Server Error" });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();

      if (!categories) {
        return res.status(404).json({ message: "Categories not found" });
      }

      res.status(200).json({ data: categories });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Intenal Server Error" });
    }
  },
};
