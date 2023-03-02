const Voucher = require("../models/Voucher");
const Nominal = require("../models/Nominal");
const Category = require("../models/Category");
const path = require("path");
const fs = require("fs");
const config = require("../../config/index");
const page_name = "vouchers";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const vouchers = await Voucher.find()
        .populate("categories")
        .populate("nominals");

      const alert = { alertMessage, alertStatus };

      res.render("./dashboard/content/vouchers/index", {
        name: req.session.user.name,
        title: "Dashboard - Vouchers",
        page_name,
        vouchers,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/vouchers");
    }
  },
  create: async (req, res) => {
    try {
      const nominals = await Nominal.find();
      const categories = await Category.find();

      res.render("./dashboard/content/vouchers/create", {
        name: req.session.user.name,
        title: "Dashboard - Vouchers",
        categories,
        nominals,
        page_name,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/vouchers");
    }
  },
  store: async (req, res) => {
    try {
      const { name, categories, nominals } = req.body;

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

        src.on("end", async () => {
          try {
            const voucher = new Voucher({
              name,
              categories,
              nominals,
              thumbnail: filename,
            });

            await voucher.save();

            req.flash("alertMessage", `Successfully create voucher`);
            req.flash("alertStatus", "success");
            res.redirect("/vouchers");
          } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/vouchers");
          }
        });
      } else {
        const voucher = new Voucher({
          name,
          categories,
          nominals,
        });

        await voucher.save();

        req.flash("alertMessage", `Successfully create voucher`);
        req.flash("alertStatus", "success");
        res.redirect("/vouchers");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/vouchers");
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id });
      const nominals = await Nominal.find();
      const categories = await Category.find();

      res.render("./dashboard/content/vouchers/edit", {
        name: req.session.user.name,
        title: "Dashboard - Vouchers",
        page_name,
        voucher,
        nominals,
        categories,
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
      const { name, categories, nominals } = req.body;

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

        src.on("end", async () => {
          try {
            const voucher = await Voucher.findOne({ _id: id });
            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Voucher.findByIdAndUpdate(
              { _id: id },
              {
                name,
                categories,
                nominals,
                thumbnail: filename,
              }
            );

            req.flash("alertMessage", `Successfully create voucher`);
            req.flash("alertStatus", "success");
            res.redirect("/vouchers");
          } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/vouchers");
          }
        });
      } else {
        await Voucher.findOneAndUpdate(
          { _id: id },
          {
            name,
            categories,
            nominals,
          }
        );

        req.flash("alertMessage", `Successfully create voucher`);
        req.flash("alertStatus", "success");
        res.redirect("/vouchers");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/vouchers");
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findOne({ _id: id });
      let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      await Voucher.findByIdAndDelete({ _id: id });

      res.json({
        status: 200,
        success: "success",
        data: { message: "Successfully Deleted Voucher" },
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/vouchers");
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id });
      let status = voucher.status === "Y" ? "N" : "Y";

      await Voucher.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertMessage", `Successfully Update Status Voucher`);
      req.flash("alertStatus", "success");
      res.redirect("/vouchers");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/vouchers");
    }
  },
};
