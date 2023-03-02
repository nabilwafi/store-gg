const Player = require("../../models/Player");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const config = require("../../../config/index");
const jwt = require("jsonwebtoken");
const Voucher = require("../../models/Voucher");
const Nominal = require("../../models/Nominal");
const Payment = require("../../models/Payment");
const Bank = require("../../models/Bank");
const Transaction = require("../../models/Transaction");
const Category = require("../../models/Category");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const payload = req.body;

      if (req.file) {
        let tempPath = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tempPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);

        payload.avatar = filename;
      }

      const player = new Player(payload);

      await player.save();

      delete player._doc.password;

      res.status(201).json({ data: player });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        res
          .status(422)
          .json({ error: 1, message: error.message, field: error.errors });
      }

      next(error);
    }
  },
  signin: async (req, res) => {
    const { email, password } = req.body;

    Player.findOne({ email: email })
      .then((player) => {
        if (!player) {
          return res
            .status(403)
            .json({ message: "Email yang anda masukan belum terdaftar" });
        }

        const checkPassword = bcrypt.compareSync(password, player.password);
        if (!checkPassword) {
          return res
            .status(403)
            .json({ message: "Password yang anda masukan salah" });
        }

        const token = jwt.sign(
          {
            player: {
              id: player.id,
              email: player.id,
              username: player.id,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          },
          config.JWTKEY
        );

        res.status(200).json({
          data: { token },
        });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ message: err.message || "Internal Server Error" })
      );
  },
  checkout: async (req, res) => {
    try {
      const { accountUser, name, voucher_id, nominal_id, payment_id, bank_id } =
        req.body;

      const voucher = await Voucher.findOne({ _id: voucher_id })
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");
      if (!voucher)
        return res.status(404).json({ message: "Voucher tidak ditemukan!" });

      const nominal = await Nominal.findOne({ _id: nominal_id });
      if (!nominal)
        return res.status(404).json({ message: "Nominal tidak ditemukan!" });

      const payment = await Payment.findOne({ _id: payment_id });
      if (!payment)
        return res.status(404).json({ message: "Payment tidak ditemukan!" });

      const bank = await Bank.findOne({ _id: bank_id }).populate("nameBank");
      if (!bank)
        return res.status(404).json({ message: "Bank tidak ditemukan!" });

      let tax = (10 / 100) * nominal._doc.price;
      let value = nominal._doc.price - tax;

      const payload = {
        historyVoucherTopup: {
          gameName: voucher._doc.name,
          category: voucher._doc.category ? voucher._doc.category.name : null,
          thumbnail: voucher._doc.thubmnail,
          coinName: nominal._doc.coinName,
          coinQuantity: nominal._doc.coinQty,
          price: nominal._doc.price,
        },
        historyPayment: {
          name: bank._doc.name,
          type: payment._doc.type,
          bankName: bank._doc.nameBank?.name,
          accountNumber: bank._doc.accountNumber,
        },
        name,
        accountUser,
        tax,
        value,
        player: req.player._id,
        historyUser: {
          name: voucher._doc.user?.name,
          phoneNumber: voucher._doc.user?.phoneNumber,
        },
        category: voucher._doc.category?._id,
        user: voucher._doc.user?._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();

      res.status(201).json({ data: payload });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  },
  history: async (req, res) => {
    try {
      const { status = "" } = req.query;

      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const history = await Transaction.find(criteria);
      let total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res.status(200).json({
        data: history,
        total: total.length ? total[0].value : 0,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Intenal Server Error" });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const history = await Transaction.findOne({ _id: id });
      if (!history)
        return res.status(404).json({ message: "history tidak ditemukan" });

      res.status(200).json({
        data: history,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Intenal Server Error" });
    }
  },
  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      const category = await Category.find({});
      category.forEach((cat) => {
        count.forEach((data) => {
          if (data._id.toString() === cat._id.toString()) {
            data.name = cat.name;
          }
        });
      });

      const history = await Transaction.find({ player: req.player._id })
        .populate("category")
        .sort({ "updateAt": -1 });

      res.status(200).json({ data: history, count });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Intenal Server Error" });
    }
  },
  getProfile: async (req, res) => {
    try {
      const player = {
        id: req.player.id,
        username: req.player.username,
        email: req.player.email,
        name: req.player.name,
        avatar: req.player.avatar,
        phoneNumber: req.player.phoneNumber,
      };

      res.status(200).json({ data: player });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Intenal Server Error" });
    }
  },
  editProfile: async (req, res) => {
    try {
      const { name = "", phoneNumber = "" } = req.body;

      const payload = {};

      if (name.length) payload.name = name;
      if (phoneNumber.length) payload.phoneNumber = phoneNumber;

      if (req.file) {
        let tempPath = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tempPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);

        src.on("error", () => {
          next(error);
        });

        payload.avatar = filename;
      }

      const player = await Player.findOneAndUpdate(
        { _id: req.player.id },
        payload,
        { new: true, runValidators: true }
      );

      const data = {
        id: player.id,
        name: player.name,
        phoneNumber: player.phoneNumber,
        avatar: player.avatar,
      };

      res.status(201).json({ data });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        res
          .status(422)
          .json({ error: 1, message: error.message, field: error.errors });
      }

      next(error);
    }
  },
};
