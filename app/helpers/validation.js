const { validationResult, check } = require("express-validator");

module.exports = {
  categoryValidation: [
    check("name")
      .isLength(3)
      .withMessage("name must have 3 or more length character"),
  ],
  categoryGuard: (req, res, next) => {
    const errors = validationResult(req);
    const page_name = "categories";

    if (!errors.isEmpty()) {
      res.render("./dashboard/content/categories/create", {
        messages: errors.array(),
        page_name,
      });
      return;
    }

    next();
  },
  nominalValidation: [
    check("coinQty").isNumeric().withMessage("Total Coin must be a number"),
  ],
  nominalGuard: (req, res, next) => {
    const errors = validationResult(req);
    const page_name = "nominals";

    if (!errors.isEmpty()) {
      res.render("./dashboard/content/nominals/create", {
        messages: errors.array(),
        page_name,
      });
      return;
    }

    next();
  },
};
